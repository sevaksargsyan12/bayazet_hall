"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export interface ServicesVideoBackgroundSource {
  src: string;
  poster?: string;
}

const noopSubscribe = () => () => {};

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export default function ServicesVideoBackground({
  sources,
  className = "",
}: {
  sources: ServicesVideoBackgroundSource[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = containerRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  // All 3 clips play simultaneously and loop forever — no cycling/advancement.
  useEffect(() => {
    if (!isVisible || reducedMotion) return;

    Promise.all(videoRefs.current.map((video) => video?.play()))
      .then(() => setAutoplayBlocked(false))
      .catch(() => setAutoplayBlocked(true));
  }, [isVisible, reducedMotion]);

  const handleManualPlay = () => {
    Promise.all(videoRefs.current.map((video) => video?.play()))
      .then(() => setAutoplayBlocked(false))
      .catch(() => {});
  };

  if (sources.length === 0) return null;

  // Tailwind emits `.relative` after `.absolute` in its stylesheet, so a
  // hardcoded base `relative` would silently win over a caller-supplied
  // `absolute inset-0 -z-10` (see BackgroundVideo.tsx for the same fix).
  const hasOwnPosition = /\b(absolute|fixed|sticky|static)\b/.test(className);

  return (
    <div
      ref={containerRef}
      className={`${hasOwnPosition ? "" : "relative"} grid h-full w-full grid-cols-3 overflow-hidden bg-black ${className}`}
    >
      {sources.map((source, i) => (
        <div key={source.src} className="relative h-full w-full overflow-hidden">
          {isVisible && !reducedMotion ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={source.src}
              poster={source.poster}
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
          ) : source.poster ? (
            <Image
              src={source.poster}
              alt=""
              fill
              sizes="33vw"
              className="object-cover"
            />
          ) : null}
        </div>
      ))}

      {isVisible && !reducedMotion && autoplayBlocked && (
        <button
          type="button"
          onClick={handleManualPlay}
          aria-label="Նվագարկել տեսանյութերը"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 transition-colors hover:bg-black/50"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/60 backdrop-blur">
            <Play
              className="h-7 w-7 translate-x-0.5 text-white"
              fill="currentColor"
              aria-hidden="true"
            />
          </span>
        </button>
      )}
    </div>
  );
}
