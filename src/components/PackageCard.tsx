import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import type { Package } from "@/data/packages";
import { formatAmd } from "@/lib/format";
import { SITE_URL } from "@/lib/constants";
import PackageItems from "@/components/PackageItems";
import ShineOnView from "@/components/ShineOnView";

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className="package-card h-full">
      <div className="group relative flex h-full flex-col">
        {pkg.highlighted && (
          <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold text-white shadow sm:px-4 sm:text-xs">
            Ամենաշատ ընտրվածը
          </span>
        )}

        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-300/60 dark:hover:shadow-amber-400/20 ${
            pkg.highlighted
              ? "border-amber-400 bg-amber-50/50 shadow-lg shadow-amber-300/70 dark:border-amber-500/50 dark:bg-amber-500/10 dark:shadow-amber-400/20"
              : "border-border bg-surface shadow-md shadow-amber-200/50 hover:border-foreground/20 dark:shadow-amber-500/10"
          }`}
        >
          <ShineOnView />

          <h3 className="text-2xl font-bold">{pkg.name}</h3>
          <p className="mt-2 text-sm text-foreground/60">{pkg.description}</p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">
              {formatAmd(pkg.pricePerPerson)}
            </span>
            <span className="text-sm text-foreground/50">
              / մեկ հոգու համար
            </span>
          </div>

          <div className="mt-6 flex-1">
            <PackageItems items={pkg.items} packageId={pkg.id} compact />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
            <Link
              href={`/packages/${pkg.id}`}
              className="text-sm font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
            >
              Մանրամասն
            </Link>
            <div className="rounded-md bg-white p-1.5 shadow-sm ring-1 ring-black/5">
              <QRCodeSVG
                value={`${SITE_URL}/packages/${pkg.id}`}
                size={48}
                level="M"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
