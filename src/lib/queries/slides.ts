import { graphqlClient } from "@/lib/graphql-client";

export interface Slide {
  src: string;
  alt: string;
}

interface GetSlidesResponse {
  slides: {
    nodes: {
      title: string;
      featuredImage: { node: { sourceUrl: string; altText: string } } | null;
    }[];
  };
}

const GET_SLIDES = /* GraphQL */ `
  query GetSlides {
    slides(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
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
`;

export async function getSlides(): Promise<Slide[]> {
  const data = await graphqlClient.request<GetSlidesResponse>(GET_SLIDES);
  return data.slides.nodes
    .filter((slide) => slide.featuredImage)
    .map((slide) => ({
      src: slide.featuredImage!.node.sourceUrl,
      // Fall back to the slide's own title when the media library item has
      // no dedicated alt text set — same pattern as gallery/services queries.
      alt: slide.featuredImage!.node.altText || slide.title,
    }));
}
