"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { SiInstagram, SiFacebook, SiWhatsapp } from "react-icons/si";
import { Menu, X, Sparkles, Tag, Image as ImageIcon, Phone } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/#services", id: "services", label: "Ծառայություններ", Icon: Sparkles },
  { href: "/#packages", id: "packages", label: "Փաթեթներ", Icon: Tag },
  { href: "/#gallery", id: "gallery", label: "Պատկերասրահ", Icon: ImageIcon },
  { href: "/#contact", id: "contact", label: "Կապ", Icon: Phone },
];

const socialLinks = [
  { href: "https://instagram.com/", label: "Instagram", Icon: SiInstagram },
  { href: "https://facebook.com/", label: "Facebook", Icon: SiFacebook },
  { href: "https://wa.me/", label: "WhatsApp", Icon: SiWhatsapp },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setIsMenuOpen(false);
    if (pathname !== "/") return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-amber-500/30 transition-transform duration-700 group-hover:rotate-360 dark:ring-amber-400/40">
              <Image
                src="/images/Logo.png"
                alt="Bayazet Hall"
                fill
                sizes="40px"
                className="object-cover"
              />
              <span
                className="logo-shine pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
            </span>
            <span className="text-xl font-semibold tracking-wide">
              Bayazet Hall
            </span>
          </Link>

          <ul className="hidden items-center gap-6 text-sm lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.id)}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <ul className="flex items-center gap-4">
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Բացել ընտրացանկը"
              aria-expanded={isMenuOpen}
              className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu backdrop — rendered outside <header> deliberately:
          backdrop-blur on the header creates a containing block for
          position:fixed descendants (same as transform would), which would
          make inset-0/inset-y-0 resolve against the header's own small box
          instead of the viewport. */}
      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ընտրացանկ"
        className={`fixed inset-y-0 right-0 z-60 flex w-1/2 min-w-65 flex-col bg-surface shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-sm font-semibold tracking-wide">
            Bayazet Hall
          </span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Փակել ընտրացանկը"
            className="rounded-full p-1.5 text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-col gap-1 px-3 py-4">
          {navLinks.map((link) => {
            const isPackages = link.id === "packages";
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                    isPackages
                      ? "border border-amber-500/30 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400"
                      : "text-foreground/80 hover:bg-foreground/5"
                  }`}
                >
                  <link.Icon
                    className={`h-5 w-5 shrink-0 ${
                      isPackages ? "text-amber-500" : "text-foreground/50"
                    }`}
                    aria-hidden="true"
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex items-center justify-center gap-5 border-t border-border px-5 py-5">
          {socialLinks.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              <Icon size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
