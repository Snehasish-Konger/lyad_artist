import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";

/** Editorial serif for headings — Fraunces' SOFT/WONK axes keep it warm rather
 *  than corporate. Work Sans carries body copy without competing. */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Artist & Portrait Commissions`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  keywords: [
    "portrait commission India",
    "devotional art",
    "pen and ink portrait",
    "anime fan art",
    "Procreate artist",
    "lyad_artist",
    "Gurugram artist",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Artist & Portrait Commissions`,
    description: site.positioning,
    url: site.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Artist & Portrait Commissions`,
    description: site.positioning,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fdfcfa",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[80] focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <div className="grain-layer" aria-hidden />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
