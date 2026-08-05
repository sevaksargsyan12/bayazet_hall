import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  servicesHeading: string;
  servicesSubtitle: string;
  servicesBackgroundVideo1: { node: { mediaItemUrl: string; title: string } } | null;
  servicesBackgroundVideo2: { node: { mediaItemUrl: string; title: string } } | null;
  servicesBackgroundVideo3: { node: { mediaItemUrl: string; title: string } } | null;
  galleryHeading: string;
  gallerySubtitle: string;
  contactHeading: string;
  contactSubtitle: string;
  contactAddress: string;
  contactPhone: string;
  contactDisplayPhone: string;
  contactCapacityNote: string;
  socialInstagramUrl: string;
  socialFacebookUrl: string;
}

interface GetSiteSettingsResponse {
  siteSettings: {
    nodes: { siteSettingsFields: SiteSettings }[];
  };
}

const GET_SITE_SETTINGS = /* GraphQL */ `
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
`;

// Wrapped in React's cache() so Hero/Services/Gallery/Contact — each of
// which independently needs a slice of this — only trigger one network
// request per render, regardless of how many of them call this.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const data = await graphqlClient.request<GetSiteSettingsResponse>(
    GET_SITE_SETTINGS
  );
  // siteSettings.nodes always has exactly 1 item — enforced singleton on the WP side.
  return data.siteSettings.nodes[0].siteSettingsFields;
});
