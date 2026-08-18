import Image from "next/image";
import type { ServiceBadgeData } from "@/data/services";

export default function ServiceBadge({ service }: { service: ServiceBadgeData }) {
  const { label, icon: Icon, image, link } = service;

  const content = (
    <>
      <div className="service-badge-circle relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-black shadow-lg sm:h-28 sm:w-28 lg:h-32 lg:w-32">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={150}
            height={150}
            className="h-full w-full object-cover"
          />
        ) : Icon ? (
          <Icon
            className="h-10 w-10 text-amber-300 sm:h-12 sm:w-12"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ) : null}
        <span className="logo-shine pointer-events-none absolute inset-0" aria-hidden="true" />
      </div>
      <span className="mt-3 text-xs font-medium text-white sm:text-sm">
        {label}
      </span>
    </>
  );

  // A service becomes clickable only when WordPress has a link set for it —
  // opens in a new tab (external destinations, e.g. an Instagram post,
  // shouldn't navigate the guest away from the site).
  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="service-badge flex w-24 flex-col items-center text-center transition-opacity hover:opacity-80 sm:w-28 lg:w-32"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="service-badge flex w-24 flex-col items-center text-center sm:w-28 lg:w-32">
      {content}
    </div>
  );
}
