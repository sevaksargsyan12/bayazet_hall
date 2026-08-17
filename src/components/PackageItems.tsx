"use client";

import { useState } from "react";
import { Check, Link2, Lock } from "lucide-react";
import DishImage from "@/components/DishImage";
import Lightbox from "@/components/Lightbox";
import type { PackageItem } from "@/data/packages";

type LightboxImage = { src: string; alt: string };

export default function PackageItems({
  items,
  packageId,
  compact = false,
  initialSelections,
  locked = false,
  showShareLink = false,
}: {
  items: PackageItem[];
  packageId: string;
  compact?: boolean;
  initialSelections?: Record<string, string[]>;
  locked?: boolean;
  showShareLink?: boolean;
}) {
  const imageSize = compact ? 60 : 66;
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(
    null
  );
  const [selections, setSelections] = useState<Record<string, string[]>>(
    () => {
      const initial: Record<string, string[]> = {};
      for (const item of items) {
        if (item.type === "fixed") continue;

        const preset = (initialSelections?.[item.id] ?? []).filter((id) =>
          item.options.some((option) => option.id === id)
        );

        if (item.type === "radio") {
          initial[item.id] =
            preset.length > 0
              ? [preset[0]]
              : item.options[0]
                ? [item.options[0].id]
                : [];
        } else {
          const max = item.max ?? item.options.length;
          initial[item.id] =
            preset.length > 0
              ? preset.slice(0, max)
              : item.options.slice(0, max).map((option) => option.id);
        }
      }
      return initial;
    }
  );

  const toggleCheckboxOption = (itemId: string, optionId: string, max: number) => {
    setSelections((prev) => {
      const current = prev[itemId] ?? [];
      if (current.includes(optionId)) {
        return { ...prev, [itemId]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= max) return prev; // defensive — UI already disables this path
      return { ...prev, [itemId]: [...current, optionId] };
    });
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {locked && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-medium text-foreground/70">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Ընտրությունը կողպված է այս հղումով և չի կարող փոփոխվել
        </div>
      )}

      {items.map((item) => {
        if (item.type === "fixed") {
          return (
            <FixedItemRow
              key={item.id}
              option={item.options[0]}
              imageSize={imageSize}
              onImageOpen={setLightboxImage}
            />
          );
        }

        if (item.type === "radio") {
          return (
            <RadioGroup
              key={item.id}
              item={item}
              groupName={`${packageId}-${item.id}`}
              imageSize={imageSize}
              compact={compact}
              selectedOptionId={selections[item.id]?.[0]}
              locked={locked}
              onSelect={(optionId) =>
                setSelections((prev) => ({ ...prev, [item.id]: [optionId] }))
              }
              onImageOpen={setLightboxImage}
            />
          );
        }

        const max = item.max ?? item.options.length;
        return (
          <CheckboxGroup
            key={item.id}
            item={item}
            imageSize={imageSize}
            compact={compact}
            selectedOptionIds={selections[item.id] ?? []}
            locked={locked}
            onToggle={(optionId) =>
              toggleCheckboxOption(item.id, optionId, max)
            }
            onImageOpen={setLightboxImage}
          />
        );
      })}

      {showShareLink && !locked && (
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

function RadioGroup({
  item,
  groupName,
  imageSize,
  compact,
  selectedOptionId,
  locked = false,
  onSelect,
  onImageOpen,
}: {
  item: PackageItem;
  groupName: string;
  imageSize: number;
  compact: boolean;
  selectedOptionId: string | undefined;
  locked?: boolean;
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
            className={`flex items-center gap-3 rounded-xl border-2 border-border p-2.5 transition-colors has-checked:border-amber-500 has-checked:bg-amber-50 dark:has-checked:bg-amber-500/10 ${
              locked
                ? "cursor-not-allowed opacity-75"
                : "cursor-pointer hover:border-foreground/20"
            }`}
          >
            <input
              type="radio"
              name={groupName}
              checked={selectedOptionId === option.id}
              disabled={locked}
              onChange={() => {
                if (!locked) onSelect(option.id);
              }}
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

function CheckboxGroup({
  item,
  imageSize,
  compact,
  selectedOptionIds,
  locked = false,
  onToggle,
  onImageOpen,
}: {
  item: PackageItem;
  imageSize: number;
  compact: boolean;
  selectedOptionIds: string[];
  locked?: boolean;
  onToggle: (optionId: string) => void;
  onImageOpen: (image: LightboxImage) => void;
}) {
  const max = item.max ?? item.options.length;

  return (
    <fieldset>
      {item.label && (
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
          {item.label} ({selectedOptionIds.length}/{max})
        </legend>
      )}
      <div className={compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2"}>
        {item.options.map((option) => {
          const checked = selectedOptionIds.includes(option.id);
          // Recomputed fresh every render from the current selection —
          // never cached — so a checked box is only ever disabled by
          // `locked`, never by being "at cap" (that's what lets the guest
          // uncheck one to free up a slot instead of getting stuck).
          const atCap = selectedOptionIds.length >= max;
          const disabled = locked || (!checked && atCap);

          return (
            <label
              key={option.id}
              className={`flex items-center gap-3 rounded-xl border-2 border-border p-2.5 transition-colors has-checked:border-amber-500 has-checked:bg-amber-50 dark:has-checked:bg-amber-500/10 ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-foreground/20"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => {
                  if (!disabled) onToggle(option.id);
                }}
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
                aria-hidden="true"
                className={`ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                  checked
                    ? "border-amber-500 bg-amber-500"
                    : "border-foreground/30"
                }`}
              >
                {checked && <Check className="h-3 w-3 text-white" />}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ShareSelectionLink({
  packageId,
  selections,
}: {
  packageId: string;
  selections: Record<string, string[]>;
}) {
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const params = new URLSearchParams();
    for (const [itemId, optionIds] of Object.entries(selections)) {
      for (const optionId of optionIds) {
        params.append(itemId, optionId);
      }
    }
    const query = params.toString();
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
