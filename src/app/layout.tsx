import type { Metadata } from "next";
import { Noto_Sans_Armenian } from "next/font/google";
import { ThemeProvider } from "next-themes";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import { getSiteSettings } from "@/lib/queries/site-settings";
import {
  DEFAULT_META_DESCRIPTION,
  SEO_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import "./globals.css";

const notoArmenian = Noto_Sans_Armenian({
  variable: "--font-armenian",
  subsets: ["armenian", "latin"],
  display: "swap",
});

const TITLE = "Bayazet Hall — Հարսանիքների և միջոցառումների սրահ";
const OG_IMAGE = `${SITE_URL}/images/Logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_META_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  // The base .ico lives at src/app/favicon.ico (Next auto-serves that one
  // at /favicon.ico) — these add the higher-res/modern variants generated
  // alongside it, which live in public/favicon/ so aren't auto-detected.
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "hy_AM",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DEFAULT_META_DESCRIPTION,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DEFAULT_META_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  // Sitewide structured data — describes the business itself (not any one
  // page's content), so it's rendered once here rather than per-page.
  // Combining LocalBusiness + EventVenue is valid JSON-LD (an array of
  // @type values) and covers both "this is a local business with an
  // address/phone" and "this is a venue for hosting events" semantics.
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EventVenue"],
    name: SITE_NAME,
    url: SITE_URL,
    image: OG_IMAGE,
    description: DEFAULT_META_DESCRIPTION,
    address: siteSettings.contactAddress,
    telephone: siteSettings.contactPhone,
    sameAs: [
      siteSettings.socialInstagramUrl,
      siteSettings.socialFacebookUrl,
    ].filter(Boolean),
  };

  return (
    <html
      lang="hy"
      className={`${notoArmenian.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={businessSchema} />
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
