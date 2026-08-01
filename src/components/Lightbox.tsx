"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type LightboxImage = { src: string; alt: string };

const noopSubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export default function Lightbox({
  image,
  images,
  onNavigate,
  onClose,
}: {
  image: LightboxImage | null;
  images?: LightboxImage[];
  onNavigate?: (direction: 1 | -1) => void;
  onClose: () => void;
}) {
  const mounted = useMounted();
  const canNavigate = Boolean(images && images.length > 1 && onNavigate);

  useEffect(() => {
    if (!image) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (canNavigate) {
        if (event.key === "ArrowLeft") onNavigate?.(-1);
        if (event.key === "ArrowRight") onNavigate?.(1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [image, onClose, canNavigate, onNavigate]);

  if (!mounted || !image) return null;

  const currentIndex = images?.findIndex(
    (candidate) => candidate.src === image.src
  );

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-6"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Փակել"
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {canNavigate && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(-1);
            }}
            aria-label="Նախորդ նկարը"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(1);
            }}
            aria-label="Հաջորդ նկարը"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <LightboxImage key={image.src} image={image} />
        <p className="mt-4 text-center text-sm font-medium text-white">
          {image.alt}
        </p>
        {images && currentIndex !== undefined && currentIndex >= 0 && (
          <p className="mt-1 text-center text-xs text-white/60">
            {currentIndex + 1} / {images.length}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}

function LightboxImage({ image }: { image: LightboxImage }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-72 w-full max-w-md items-center justify-center rounded-xl bg-neutral-700 p-6 text-center text-neutral-300">
        {image.alt}
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] w-full">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="rounded-xl object-contain"
        sizes="(max-width: 768px) 100vw, 700px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
