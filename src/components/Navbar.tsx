import Link from "next/link";
import Image from "next/image";
import { SiInstagram, SiFacebook, SiWhatsapp } from "react-icons/si";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/#packages", label: "Փաթեթներ" },
  { href: "/#gallery", label: "Պատկերասրահ" },
  { href: "/#contact", label: "Կապ" },
];

const socialLinks = [
  { href: "https://instagram.com/", label: "Instagram", Icon: SiInstagram },
  { href: "https://facebook.com/", label: "Facebook", Icon: SiFacebook },
  { href: "https://wa.me/", label: "WhatsApp", Icon: SiWhatsapp },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-amber-500/30 transition-transform duration-700 group-hover:rotate-360 dark:ring-amber-400/40">
            <Image
              src="/images/logo.jpg"
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
        <ul className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
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
      </nav>
    </header>
  );
}
