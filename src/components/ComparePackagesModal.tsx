"use client";

import { Fragment, useEffect, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import type { Package } from "@/data/packages";
import {
  buildPackageComparison,
  type CategoryComparisonGroup,
} from "@/lib/compare-packages";

const noopSubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export default function ComparePackagesModal({
  packages,
  open,
  onClose,
}: {
  packages: Package[];
  open: boolean;
  onClose: () => void;
}) {
  const mounted = useMounted();
  const comparison = useMemo(() => buildPackageComparison(packages), [packages]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const columnCount = comparison.packages.length;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Փաթեթների համեմատություն"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">Փաթեթների համեմատություն</h2>
            <p className="mt-0.5 text-xs text-foreground/50">
              Ցուցադրված են միայն տարբերվող բաժինները
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Փակել"
            className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-x-auto px-6 py-4">
          {comparison.groups.length === 0 ? (
            <p className="py-10 text-center text-sm text-foreground/60">
              Բոլոր փաթեթների բաժինները նույնական են՝ տարբերություններ չկան։
            </p>
          ) : (
            <div
              className="grid min-w-max gap-y-1"
              style={{
                gridTemplateColumns: `160px repeat(${columnCount}, minmax(140px, 1fr))`,
              }}
            >
              <div className="sticky left-0 z-10 bg-surface" />
              {comparison.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="px-2 pb-2 text-center text-sm font-semibold text-foreground"
                >
                  {pkg.name}
                </div>
              ))}

              {comparison.groups.map((group) => (
                <GroupRows
                  key={group.categoryId}
                  group={group}
                  packages={comparison.packages}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function GroupRows({
  group,
  packages,
}: {
  group: CategoryComparisonGroup;
  packages: { id: string; name: string }[];
}) {
  const showPresenceRow = group.presence.some((p) => !p.included);

  return (
    <>
      <div className="col-span-full mt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-foreground/50">
        {group.label}
      </div>

      {showPresenceRow && (
        <>
          <div className="sticky left-0 z-10 bg-surface py-1.5 pr-2 text-sm text-foreground/80">
            Ընդգրկվածությունը
          </div>
          {packages.map((pkg) => {
            const included = group.presence.find(
              (p) => p.packageId === pkg.id
            )?.included;
            return (
              <div
                key={pkg.id}
                className="flex items-center justify-center py-1.5"
              >
                {included ? (
                  <Check className="h-4 w-4 text-amber-600" aria-hidden="true" />
                ) : (
                  <span className="text-xs text-foreground/40">Ընդգրկված չէ</span>
                )}
              </div>
            );
          })}
        </>
      )}

      {group.dishDiffs.map((dish) => (
        <Fragment key={dish.dishId}>
          <div className="sticky left-0 z-10 bg-surface py-1.5 pr-2 text-sm text-foreground/80">
            {dish.name}
          </div>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-center py-1.5"
            >
              {dish.presentIn.includes(pkg.id) ? (
                <Check className="h-4 w-4 text-amber-600" aria-hidden="true" />
              ) : (
                <span className="text-foreground/30" aria-hidden="true">
                  —
                </span>
              )}
            </div>
          ))}
        </Fragment>
      ))}
    </>
  );
}
