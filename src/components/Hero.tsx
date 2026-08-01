"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/images/hero/6cbf3c4a-0100-4db7-a8e9-e39ab8099931.webp",
    alt: "Bayazet Hall-ի շենքի տեսքը մայրամուտին՝ հրավառությամբ",
  },
  {
    src: "/images/hero/397ed723-07aa-4f76-87db-6451116c54f5.webp",
    alt: "Հարսնացուն և փեսան Bayazet Hall-ի մուտքի մոտ՝ հրավառության ներքո",
  },
  {
    src: "/images/hero/9c08afc1-430f-4da6-bedc-0d55cb042668.webp",
    alt: "Հյուրերն ու նորապսակները Bayazet Hall-ի բակում՝ երեկոյան միջոցառման ժամանակ",
  },
  {
    src: "/images/hero/77d24a17-1b9d-499f-a487-bdfc34f36e05.webp",
    alt: "Bayazet Hall-ի շքամուտքը՝ գիշերային լուսավորությամբ և հրավառությամբ",
  },
];

const noopSubscribe = () => () => {};

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused, reducedMotion]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section
      id="hero"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />
      </div>

      <div className="mx-auto max-w-3xl px-6 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-6xl">Bayazet Hall</h1>
        <p className="mt-4 text-lg text-white/80 sm:text-xl">
          Հարսանիքների և միջոցառումների սրահ
        </p>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Նախորդ նկարը"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Հաջորդ նկարը"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Անցնել ${i + 1}-րդ նկարին`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
