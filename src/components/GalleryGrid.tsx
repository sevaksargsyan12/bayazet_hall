"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import type { GalleryImage } from "@/data/gallery";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            aria-label={`Ցուցադրել «${img.alt}» նկարը մեծացված`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        image={lightboxIndex !== null ? images[lightboxIndex] : null}
        images={images}
        onNavigate={(direction) =>
          setLightboxIndex((i) =>
            i === null ? null : (i + direction + images.length) % images.length
          )
        }
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
