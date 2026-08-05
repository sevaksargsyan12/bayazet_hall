"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

export interface BackgroundVideoSource {
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

export default function BackgroundVideo({
  sources,
  className = "",
}: {
  sources: BackgroundVideoSource[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const nextIndex = (activeIndex + 1) % sources.length;

  // Don't start loading anything until the section nears the viewport.
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

  // Play whichever video is currently active. The "next" video (see
  // shouldLoad below) is preloaded but never auto-played, so this is the
  // only place playback is actually started.
  useEffect(() => {
    if (!isVisible || reducedMotion) return;
    const video = videoRefs.current[activeIndex];
    if (!video) return;

    // `muted` + `playsInline` (both already set on the element below) are
    // what make autoplay-without-a-gesture reliable on iOS/Android — no
    // fallback UI is shown if it's ever blocked regardless, so the
    // rejection is simply swallowed.
    const playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(() => {});
    }
  }, [isVisible, reducedMotion, activeIndex]);

  const handleEnded = (index: number) => {
    if (index !== activeIndex) return;
    setActiveIndex((i) => (i + 1) % sources.length);
  };

  if (sources.length === 0) return null;

  // `relative` is only a sensible default when the caller hasn't already
  // supplied their own `position` utility (e.g. `absolute inset-0 -z-10` to
  // use this as a full-bleed background layer) — Tailwind emits `.relative`
  // after `.absolute` in its generated stylesheet, so naively always
  // including `relative` here would silently win the cascade and break
  // that positioning.
  const hasOwnPosition = /\b(absolute|fixed|sticky|static)\b/.test(className);

  return (
    <div
      ref={containerRef}
      className={`${hasOwnPosition ? "" : "relative"} h-full w-full overflow-hidden bg-black ${className}`}
    >
      {sources.map((source, i) => {
        // Only ever keep the active clip and the one coming up next loaded —
        // everything else stays unmounted (poster image only) until its turn.
        const shouldLoad =
          isVisible && !reducedMotion && (i === activeIndex || i === nextIndex);
        const isActive = i === activeIndex;

        return (
          <div
            key={source.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {shouldLoad ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={source.src}
                poster={source.poster}
                muted
                // Native `loop` would swallow the `ended` event we rely on to
                // advance the playlist, so it's only used for a single-clip
                // list (nothing to advance to). Cycling loops at the
                // playlist level instead, driven by handleEnded below.
                loop={sources.length === 1}
                playsInline
                preload="auto"
                onEnded={() => handleEnded(i)}
                className="h-full w-full object-cover"
              />
            ) : source.poster ? (
              <Image
                src={source.poster}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
