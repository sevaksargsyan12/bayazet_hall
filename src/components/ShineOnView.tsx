"use client";

import { useEffect, useRef, useState } from "react";

export default function ShineOnView() {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || triggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [triggered]);

  return (
    <span
      ref={ref}
      className={`shine-sweep pointer-events-none absolute inset-0 ${
        triggered ? "shine-sweep-play" : ""
      }`}
      aria-hidden="true"
    />
  );
}
