import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { packages } from "@/data/packages";

export const metadata: Metadata = {
  title: "Փաթեթներ — Bayazet Hall",
  description: "Bayazet Hall-ի հարսանիքի և միջոցառումների փաթեթները և գները։",
};

export default function PackagesPage() {
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

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
