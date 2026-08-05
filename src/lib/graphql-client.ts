import { GraphQLClient } from "graphql-request";

// Content (services, packages, dishes, gallery, slides, ...) is edited in
// WordPress, not redeployed with the app. In dev this must always be fresh
// (no-store) — editing WP and reloading should show the change immediately,
// not require a dev-server restart. In production we still want the
// speed/WP-load benefits of caching, so fetches are revalidated on a timer
// instead of being fully static forever.
const fetchOptions =
  process.env.NODE_ENV === "development"
    ? ({ cache: "no-store" } as const)
    : { next: { revalidate: 60 } };

export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL!,
  fetchOptions
);
