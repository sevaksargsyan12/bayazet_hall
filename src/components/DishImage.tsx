"use client";

import { useState } from "react";
import Image from "next/image";

export default function DishImage({
  src,
  alt,
  size = 44,
  onOpen,
}: {
  src: string;
  alt: string;
  size?: number;
  onOpen?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  // A dish with no uploaded photo yet comes through as an empty string —
  // show the placeholder immediately rather than handing next/image an
  // empty src (which errors) and waiting on onError to catch it.
  const showPlaceholder = failed || !src;

  const visual = showPlaceholder ? (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-md bg-neutral-200 p-1 text-center text-[8px] leading-tight text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300"
    >
      {alt}
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-md object-cover"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );

  if (!onOpen) {
    return <div className="shrink-0">{visual}</div>;
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen();
      }}
      className="shrink-0 cursor-zoom-in rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
      aria-label={`Ցուցադրել «${alt}» նկարը մեծացված`}
    >
      {visual}
    </button>
  );
}
