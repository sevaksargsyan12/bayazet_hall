import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import type { DishOption, Package, PackageItem } from "@/data/packages";

interface WPDishCategory {
  name: string;
  slug: string;
  selectionType: "single_select" | "fixed_included";
  displayOrder: number;
}

interface WPDish {
  id: string;
  slug: string;
  title: string;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  dishCategories: { nodes: WPDishCategory[] };
}

interface WPPackage {
  id: string;
  slug: string;
  title: string;
  packageDetails: {
    price: number;
    description: string;
    highlighted: boolean;
    includedItems: { nodes: WPDish[] };
  };
}

interface GetPackagesResponse {
  packages: { nodes: WPPackage[] };
}

// NOTE: docs/bayazet-hall-graphql-integration.md §4.4's query omits an
// explicit `first:` argument on `packages(...)`, despite §3 itself warning
// every list query needs one or silently truncates at 10. Added `first: 20`
// here. Also added `id`/`slug` on both the package and each `Dish` node —
// the doc's query doesn't select them, but our routing/keys need a stable
// identifier and none of the doc's other fields provide one.
const GET_PACKAGES = /* GraphQL */ `
  query GetPackages {
    packages(
      first: 20
      where: { orderby: { field: MENU_ORDER, order: ASC } }
    ) {
      nodes {
        id
        slug
        title
        packageDetails {
          price
          description
          highlighted
          includedItems {
            nodes {
              ... on Dish {
                id
                slug
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
                    displayOrder
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Groups a package's flat dish list into the fixed/choice item shape our
 * components already render, per the integration doc §4.4:
 *
 * - Bucket dishes by their first category's slug, sort buckets by
 *   `displayOrder`.
 * - `single_select` categories become ONE choice-type PackageItem holding
 *   every dish in that bucket as selectable `options` (first one is the
 *   pre-selected default — PackageItems.tsx already implements this).
 * - `fixed_included` categories become ONE fixed-type PackageItem PER DISH,
 *   not grouped — a category can hold multiple always-included dishes (e.g.
 *   the Royal package's "cold-appetizers" bucket has 3), and the fixed-item
 *   renderer only ever shows a single dish per item, so grouping them would
 *   silently drop all but the first.
 */
function groupDishesByCategory(dishes: WPDish[]): PackageItem[] {
  const bucketOrder: string[] = [];
  const buckets = new Map<string, { category: WPDishCategory; dishes: WPDish[] }>();

  for (const dish of dishes) {
    const category = dish.dishCategories.nodes[0];
    if (!category) continue;
    if (!buckets.has(category.slug)) {
      buckets.set(category.slug, { category, dishes: [] });
      bucketOrder.push(category.slug);
    }
    buckets.get(category.slug)!.dishes.push(dish);
  }

  const sortedBuckets = bucketOrder
    .map((slug) => buckets.get(slug)!)
    .sort((a, b) => a.category.displayOrder - b.category.displayOrder);

  const items: PackageItem[] = [];

  for (const { category, dishes: bucketDishes } of sortedBuckets) {
    const options: DishOption[] = bucketDishes.map((dish) => ({
      id: dish.id,
      name: dish.title,
      imageUrl: dish.featuredImage?.node.sourceUrl ?? "",
    }));

    if (category.selectionType === "single_select") {
      items.push({
        id: category.slug,
        type: "choice",
        label: category.name,
        options,
      });
    } else {
      options.forEach((option, index) => {
        items.push({
          id: `${category.slug}-${index}`,
          type: "fixed",
          options: [option],
        });
      });
    }
  }

  return items;
}

// cache()'d since /packages/[id] calls this from both generateMetadata and
// the page component within the same request's render — this dedupes those
// two into one network round-trip. generateStaticParams runs in a separate
// build-time phase and issues its own call regardless.
export const getPackages = cache(async (): Promise<Package[]> => {
  const data = await graphqlClient.request<GetPackagesResponse>(GET_PACKAGES);

  return data.packages.nodes.map((pkg) => ({
    id: pkg.slug,
    name: pkg.title,
    pricePerPerson: pkg.packageDetails.price,
    description: pkg.packageDetails.description,
    highlighted: pkg.packageDetails.highlighted,
    items: groupDishesByCategory(pkg.packageDetails.includedItems.nodes),
  }));
});
