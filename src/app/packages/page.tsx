import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackagesGrid from "@/components/PackagesGrid";
import ComparePackagesButton from "@/components/ComparePackagesButton";
import { getPackages } from "@/lib/queries/packages";
import { SEO_KEYWORDS } from "@/lib/constants";

// See src/app/page.tsx for why this is needed — packages/dishes are edited
// in WordPress and need to reappear without a manual rebuild.
export const revalidate = 60;

// `title` here is just "Փաթեթներ" (not the full "Փաթեթներ — Bayazet Hall")
// because the root layout's title.template appends the site name — setting
// the full string here would duplicate it.
export const metadata: Metadata = {
  title: "Փաթեթներ",
  description: "Bayazet Hall-ի հարսանիքի և միջոցառումների փաթեթները և գները։",
  keywords: [...SEO_KEYWORDS, "հարսանիքի փաթեթներ", "միջոցառման փաթեթներ"],
  alternates: {
    canonical: "/packages",
  },
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <h1 className="text-center text-3xl font-bold sm:text-4xl">
            Փաթեթներ
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
            Ընտրեք ձեր միջոցառմանը հարմար փաթեթը։
          </p>

          <div className="mt-6 flex justify-center">
            <ComparePackagesButton packages={packages} />
          </div>

          <PackagesGrid packages={packages} />
        </section>
      </main>
      <Footer />
    </>
  );
}
