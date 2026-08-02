import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackagesGrid from "@/components/PackagesGrid";

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

          <PackagesGrid />
        </section>
      </main>
      <Footer />
    </>
  );
}
