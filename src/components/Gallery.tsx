import { getSiteSettings } from "@/lib/queries/site-settings";
import { getGalleryImages } from "@/lib/queries/gallery";
import GalleryGrid from "@/components/GalleryGrid";

export default async function Gallery() {
  const [siteSettings, galleryImages] = await Promise.all([
    getSiteSettings(),
    getGalleryImages(),
  ]);

  return (
    <section id="gallery" className="bg-surface-muted py-20 scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          {siteSettings.galleryHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
          {siteSettings.gallerySubtitle}
        </p>

        <GalleryGrid images={galleryImages} />
      </div>
    </section>
  );
}
