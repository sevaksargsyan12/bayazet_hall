import type { Metadata } from "next";
import { Noto_Sans_Armenian } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const notoArmenian = Noto_Sans_Armenian({
  variable: "--font-armenian",
  subsets: ["armenian", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bayazet Hall — Հարսանիքների և միջոցառումների սրահ",
  description:
    "Bayazet Hall — հարսանիքների, տոնակատարությունների և միջոցառումների սրահ Հայաստանում։",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hy"
      className={`${notoArmenian.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
