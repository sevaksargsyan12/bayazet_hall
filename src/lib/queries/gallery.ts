import { graphqlClient } from "@/lib/graphql-client";
import type { GalleryImage } from "@/data/gallery";

interface GetGalleryImagesResponse {
  galleryImages: {
    nodes: {
      id: string;
      title: string;
      featuredImage: { node: { sourceUrl: string; altText: string } } | null;
    }[];
  };
}

const GET_GALLERY_IMAGES = /* GraphQL */ `
  query GetGalleryImages {
    galleryImages(
      first: 50
      where: { orderby: { field: MENU_ORDER, order: ASC } }
    ) {
      nodes {
        id
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

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const data = await graphqlClient.request<GetGalleryImagesResponse>(
    GET_GALLERY_IMAGES
  );
  return data.galleryImages.nodes
    .filter((image) => image.featuredImage)
    .map((image) => ({
      id: image.id,
      src: image.featuredImage!.node.sourceUrl,
      alt: image.featuredImage!.node.altText || image.title,
    }));
}
