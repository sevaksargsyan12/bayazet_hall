import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Content (services, packages, dishes, gallery, slides) is edited in
// WordPress, not redeployed with the app — without this the page is a pure
// static export baked at build time and WP edits never appear until the
// next manual rebuild. Revalidating every 60s lets edits show up on their
// own via ISR.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Packages />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
