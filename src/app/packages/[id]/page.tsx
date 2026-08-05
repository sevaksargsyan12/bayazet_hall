import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageItems from "@/components/PackageItems";
import { getPackages } from "@/lib/queries/packages";
import { formatAmd } from "@/lib/format";

// See src/app/page.tsx for why this is needed — packages/dishes are edited
// in WordPress and need to reappear without a manual rebuild.
export const revalidate = 60;

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const packages = await getPackages();
  // This Next.js version hands dynamic-segment params through raw (still
  // percent-encoded), unlike the auto-decoding behavior of older versions —
  // decode before comparing against our (decoded) package ids.
  const pkg = packages.find((p) => p.id === decodeURIComponent(id));

  return {
    title: pkg ? `${pkg.name} — Bayazet Hall` : "Փաթեթ — Bayazet Hall",
    description: pkg?.description,
  };
}

export default async function PackageDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const packages = await getPackages();
  const pkg = packages.find((p) => p.id === decodeURIComponent(id));

  if (!pkg) {
    notFound();
  }

  const initialSelections: Record<string, string> = {};
  for (const item of pkg.items) {
    if (item.type !== "choice") continue;
    const raw = resolvedSearchParams[item.id];
    const optionId = Array.isArray(raw) ? raw[0] : raw;
    if (optionId && item.options.some((option) => option.id === optionId)) {
      initialSelections[item.id] = optionId;
    }
  }
  // A URL only carries selections once it's been through
  // ShareSelectionLink's "generate link" flow — a customer's own first
  // visit never has any. Treat that as "this is a shared link" and freeze
  // it so whoever opens it next (e.g. the manager) can't change it.
  const locked = Object.keys(initialSelections).length > 0;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 py-16">
          <Link
            href="/packages"
            className="text-sm font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
          >
            ← Բոլոր փաթեթները
          </Link>

          <div
            className={`mt-6 rounded-2xl border p-8 ${
              pkg.highlighted
                ? "border-amber-400 bg-amber-50/50 shadow-lg shadow-amber-100 dark:border-amber-500/50 dark:bg-amber-500/10 dark:shadow-amber-400/20"
                : "border-border bg-surface"
            }`}
          >
            {pkg.highlighted && (
              <span className="mb-4 inline-block rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-white shadow">
                Ամենաշատ ընտրվածը
              </span>
            )}

            <h1 className="text-3xl font-bold sm:text-4xl">{pkg.name}</h1>
            <p className="mt-2 text-foreground/60">{pkg.description}</p>
            <p className="mt-4 text-sm text-foreground/60">
              {locked
                ? "Այս հղումն արդեն պարունակում է ընտրված տարբերակները։"
                : "Ընտրեք Ձեզ նախընտրելի տարբերակները և կիսվեք հղումով մեր մենեջերի հետ։"}
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">
                {formatAmd(pkg.pricePerPerson)}
              </span>
              <span className="text-sm text-foreground/50">
                / մեկ հոգու համար
              </span>
            </div>

            <div className="mt-10">
              <PackageItems
                items={pkg.items}
                packageId={pkg.id}
                initialSelections={initialSelections}
                locked={locked}
                showShareLink
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
