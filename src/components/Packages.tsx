import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import PackagesGrid from "@/components/PackagesGrid";
import ComparePackagesButton from "@/components/ComparePackagesButton";
import { getPackages } from "@/lib/queries/packages";
import { SITE_URL } from "@/lib/constants";

export default async function Packages() {
  const packages = await getPackages();

  return (
    <section id="packages" className="mx-auto w-full max-w-6xl px-6 py-20 scroll-mt-24">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold sm:text-4xl">Փաթեթներ</h2>
          <p className="mx-auto mt-3 max-w-2xl text-foreground/70 sm:mx-0">
            Ընտրեք ձեր միջոցառմանը հարմար փաթեթը։
          </p>
          <div className="mt-4 flex justify-center sm:justify-start">
            <ComparePackagesButton packages={packages} />
          </div>
        </div>

        <Link
          href="/packages"
          className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border border-black/10 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
        >
          <QRCodeSVG value={`${SITE_URL}/packages`} size={64} level="M" />
          <span className="text-[11px] text-foreground">Սկանավորեք</span>
        </Link>
      </div>

      <PackagesGrid packages={packages} />
    </section>
  );
}
