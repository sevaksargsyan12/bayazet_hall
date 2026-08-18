# Bayazet Hall — Next.js ↔ WordPress GraphQL Integration Spec

This document defines every GraphQL query needed to power the existing Next.js
frontend from the headless WordPress backend, plus the environment variables
and known field-naming gotchas required to implement it correctly.

## 1. Environment variables

Add to `.env.local` (dev) and your hosting provider's env config (production):

```
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=http://localhost/bayazet-hall/graphql
```

For production, replace with the real domain once deployed, e.g.
`https://cms.bayazethall.am/graphql`. Keep the `NEXT_PUBLIC_` prefix since this
URL is called from both server and client components.

## 2. GraphQL client setup

Use `graphql-request` (lightweight, no extra caching layer needed since
Next.js's own fetch caching + WPGraphQL Smart Cache already handle this).

```
npm install graphql-request graphql
```

```ts
// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL!
);
```

## 3. Known field-naming gotchas (read before writing queries)

These were discovered empirically against the live schema and differ from
naive assumptions — implement queries exactly as written below, not as
"logically expected" names:

- **Pagination defaults to 10 items per connection.** Every list query below
  includes an explicit `first:` argument. Omitting it silently truncates
  results past item 10 with no error — this WILL bite you on `dishes`,
  `galleryImages`, etc. if forgotten in new queries.
- **Default sort order is by date, not menu_order.** Every ordered list needs
  `where: { orderby: { field: MENU_ORDER, order: ASC } }` explicitly, or drag-
  ordering done in wp-admin will have no effect on the frontend.
- **Image fields vs File/video fields resolve differently:**
  - Image fields (Dish photos, Gallery images, Slide backgrounds, Service
    icons) → use `sourceUrl` on the `node`. Works reliably.
  - File/video fields (the 3 hero background videos) → `sourceUrl` returns
    `null` unreliably for video mime types. Use `mediaItemUrl` instead.
- **The `menu_item` CPT is exposed in GraphQL as `Dish`** (not `MenuItem` —
  that name collides with WordPress's built-in nav menu item type). Its
  taxonomy is exposed as `DishCategory`.
- **Relationship fields return a connection, not a plain array.** Always go
  through `{ nodes { ... } }`, e.g. `includedItems { nodes { ... } }`.
- **Within a package's `includedItems`, order = default selection AND
  display order.** For any `DishCategory` where `selectionType` is `1` or
  higher, the first dish(es) in the array belonging to that category are
  the pre-selected default(s) on load. Group dishes by
  `dishCategories.nodes[0].slug` client-side to reconstruct the category
  groupings (Salad, Main dish, etc.) shown in the UI — **categories render
  in the exact order they first appear in `includedItems`, with no
  client-side re-sorting** (there's no `displayOrder` field; the backend
  array order is authoritative).
- **`selectionType` is an Int, not a string enum**: `0` = fixed/included, no
  guest choice; `1` = guest picks exactly 1 (radio); `2` or higher = guest
  picks exactly that many (checkbox, capped at that count).
- **`DishCategory.info`** is free-text selection-rule copy (e.g. "Ընտրեք
  ցանկացած 2-ը") shown next to a radio/checkbox category's name — an empty
  string means nothing is shown. Never construct this text on the frontend.
- **`DishCategory.showInFront`** (Boolean) — categories with `false` are
  dropped entirely from the client-side grouping and never rendered, even
  though their dishes are still present in `includedItems`.

## 4. Queries

### 4.1 Site Settings (global — fetch once, used across Header/Hero/Services/Gallery/Contact/Footer)

```graphql
query GetSiteSettings {
  siteSettings {
    nodes {
      siteSettingsFields {
        heroTitle
        heroSubtitle
        servicesHeading
        servicesSubtitle
        servicesBackgroundVideo1 { node { mediaItemUrl title } }
        servicesBackgroundVideo2 { node { mediaItemUrl title } }
        servicesBackgroundVideo3 { node { mediaItemUrl title } }
        galleryHeading
        gallerySubtitle
        contactHeading
        contactSubtitle
        contactAddress
        contactPhone
        contactDisplayPhone
        contactCapacityNote
        socialInstagramUrl
        socialFacebookUrl
      }
    }
  }
}
```

Note: `siteSettings.nodes` always returns exactly 1 item (enforced singleton
on the WP side) — safe to access `siteSettings.nodes[0]` directly.

### 4.2 Hero Slides

```graphql
query GetSlides {
  slides(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}
```

Slide title/subtitle text comes from `siteSettings.heroTitle` /
`heroSubtitle` (shared across all slides) — slides only carry the background
image, per the current site-wide-text decision.

### 4.3 Services

```graphql
query GetServices {
  services(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      id
      title
      serviceIcon {
        icon {
          node {
            sourceUrl
            altText
          }
        }
        link
      }
    }
  }
}
```

Note: the field is `serviceIcon`, not `serviceFields` — confirmed against the live schema (an earlier version of this doc had it wrong).

`serviceIcon.link` is optional free text (empty string when unset) — when present, the badge opens it in a new tab; when empty/absent, the badge stays non-interactive (a plain `<div>`, not a link).

### 4.4 Packages (with grouped dishes)

```graphql
query GetPackages {
  packages(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      title
      packageDetails {
        price
        description
        highlighted
        includedItems(first: 100) {
          nodes {
            ... on Dish {
              title
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              dishCategories {
                nodes {
                  name
                  slug
                  selectionType
                  info
                  showInFront
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**Client-side transform needed:** the API returns a flat list of dishes per
package. Group `includedItems.nodes` by `dishCategories.nodes[0].slug`, in
the exact order categories first appear (no re-sorting), dropping any
category where `showInFront === false`. Every surviving category renders
its `name` as a heading regardless of type, and within each group, branch
on `selectionType` (an Int):
- `0` → render as a plain checkmarked list, no interaction
- `1` → render as radio options, first item in the array pre-selected. Show
  an info icon next to the heading (with the category's `info` text) if
  `info` is non-empty.
- `2` or higher → render as checkboxes, capped at exactly `selectionType`
  selections; pre-select the first `selectionType` dishes as defaults, and
  disable any unselected checkbox once the cap is reached (the guest must
  uncheck one before checking another). Same info icon as radio when `info`
  is non-empty; hovering a capped-out checkbox also surfaces that same text.

### 4.5 Gallery

```graphql
query GetGalleryImages {
  galleryImages(first: 50, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes {
      title
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}
```

## 5. Out of scope (confirmed — do not implement against WordPress)

- Contact form submission stays entirely in the existing Next.js
  `POST /api/contact` route handler. No WordPress involvement.
- Site logo and site title (wordmark) stay hardcoded in the Next.js codebase,
  not fetched from WordPress.
- UI microcopy (button labels, nav labels, ARIA text, form validation
  messages) stays hardcoded in Next.js, not sourced from WordPress.
