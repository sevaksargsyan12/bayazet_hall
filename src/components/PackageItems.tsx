"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import DishImage from "@/components/DishImage";
import Lightbox from "@/components/Lightbox";
import type { PackageItem } from "@/data/packages";

type LightboxImage = { src: string; alt: string };

export default function PackageItems({
  items,
  packageId,
  compact = false,
  initialSelections,
  showShareLink = false,
}: {
  items: PackageItem[];
  packageId: string;
  compact?: boolean;
  initialSelections?: Record<string, string>;
  showShareLink?: boolean;
}) {
  const imageSize = compact ? 60 : 66;
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(
    null
  );
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of items) {
      if (item.type !== "choice") continue;
      const preset = initialSelections?.[item.id];
      const isValidPreset =
        preset && item.options.some((option) => option.id === preset);
      initial[item.id] = isValidPreset ? preset! : item.options[0]?.id;
    }
    return initial;
  });

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {items.map((item) =>
        item.type === "fixed" ? (
          <FixedItemRow
            key={item.id}
            option={item.options[0]}
            imageSize={imageSize}
            onImageOpen={setLightboxImage}
          />
        ) : (
          <ChoiceGroup
            key={item.id}
            item={item}
            groupName={`${packageId}-${item.id}`}
            imageSize={imageSize}
            compact={compact}
            selectedOptionId={selections[item.id]}
            onSelect={(optionId) =>
              setSelections((prev) => ({ ...prev, [item.id]: optionId }))
            }
            onImageOpen={setLightboxImage}
          />
        )
      )}

      {showShareLink && (
        <ShareSelectionLink packageId={packageId} selections={selections} />
      )}

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}

function FixedItemRow({
  option,
  imageSize,
  onImageOpen,
}: {
  option: PackageItem["options"][number];
  imageSize: number;
  onImageOpen: (image: LightboxImage) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <DishImage
        src={option.imageUrl}
        alt={option.name}
        size={imageSize}
        onOpen={() => onImageOpen({ src: option.imageUrl, alt: option.name })}
      />
      <span className="text-sm text-foreground/80">{option.name}</span>
      <Check
        className="ml-auto h-4 w-4 shrink-0 text-amber-600"
        aria-hidden="true"
      />
    </div>
  );
}

function ChoiceGroup({
  item,
  groupName,
  imageSize,
  compact,
  selectedOptionId,
  onSelect,
  onImageOpen,
}: {
  item: PackageItem;
  groupName: string;
  imageSize: number;
  compact: boolean;
  selectedOptionId: string;
  onSelect: (optionId: string) => void;
  onImageOpen: (image: LightboxImage) => void;
}) {
  return (
    <fieldset>
      {item.label && (
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
          {item.label}
        </legend>
      )}
      <div className={compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2"}>
        {item.options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border p-2.5 transition-colors hover:border-foreground/20 has-checked:border-amber-500 has-checked:bg-amber-50 dark:has-checked:bg-amber-500/10"
          >
            <input
              type="radio"
              name={groupName}
              checked={selectedOptionId === option.id}
              onChange={() => onSelect(option.id)}
              className="peer sr-only"
            />
            <DishImage
              src={option.imageUrl}
              alt={option.name}
              size={imageSize}
              onOpen={() =>
                onImageOpen({ src: option.imageUrl, alt: option.name })
              }
            />
            <span className="text-sm text-foreground/80 peer-checked:font-semibold">
              {option.name}
            </span>
            <span
              className="ml-auto h-4 w-4 shrink-0 rounded-full border-2 border-foreground/30 peer-checked:border-amber-500 peer-checked:bg-amber-500"
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ShareSelectionLink({
  packageId,
  selections,
}: {
  packageId: string;
  selections: Record<string, string>;
}) {
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const query = new URLSearchParams(selections).toString();
    const url = `${window.location.origin}/packages/${packageId}${
      query ? `?${query}` : ""
    }`;
    setLink(url);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard API unavailable — the field below still lets the user copy manually.
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-border bg-surface-muted p-4">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
      >
        <Link2 className="h-4 w-4" aria-hidden="true" />
        {copied ? "Հղումը պատճենված է" : "Կիսվել ընտրությամբ"}
      </button>

      {link && (
        <input
          readOnly
          value={link}
          onFocus={(event) => event.target.select()}
          className="mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground/70"
        />
      )}

      <p className="mt-2 text-xs text-foreground/50">
        Ուղարկեք այս հղումը մենեջերին՝ ձեր ընտրած տարբերակներով փաթեթը
        տեսնելու համար։
      </p>
    </div>
  );
}
