import { graphqlClient } from "@/lib/graphql-client";
import type { ServiceBadgeData } from "@/data/services";

interface GetServicesResponse {
  services: {
    nodes: {
      id: string;
      title: string;
      serviceIcon: {
        icon: { node: { sourceUrl: string; altText: string } } | null;
        link: string | null;
      } | null;
    }[];
  };
}

// NOTE: the integration doc (docs/bayazet-hall-graphql-integration.md §4.3)
// documents this as `serviceFields { icon { node {...} } } }` — that field
// does not exist on the live schema (confirmed against the running WP
// instance; the actual error suggests "serviceIcon" instead). The correct
// path, empirically verified, is `serviceIcon { icon { node {...} } } }`.
const GET_SERVICES = /* GraphQL */ `
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
`;

export async function getServices(): Promise<ServiceBadgeData[]> {
  const data = await graphqlClient.request<GetServicesResponse>(GET_SERVICES);
  return data.services.nodes.map((service) => ({
    id: service.id,
    label: service.title,
    image: service.serviceIcon?.icon
      ? {
          src: service.serviceIcon.icon.node.sourceUrl,
          alt: service.serviceIcon.icon.node.altText || service.title,
        }
      : undefined,
    link: service.serviceIcon?.link || undefined,
  }));
}
