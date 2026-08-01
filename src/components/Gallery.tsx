import { galleryImages } from "@/data/gallery";
import GalleryGrid from "@/components/GalleryGrid";

export default function Gallery() {
  return (
    <section id="gallery" className="bg-surface-muted py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Պատկերասրահ
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
          Դիտեք մեր սրահի և միջոցառումների լուսանկարները։
        </p>

        <GalleryGrid images={galleryImages} />
      </div>
    </section>
  );
}
