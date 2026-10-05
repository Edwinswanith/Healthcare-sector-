import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./globals.css";
import { brand } from "@/content/site";
import { allowIndexing, siteUrl } from "@/lib/site";
import { Header } from "@/components/ui/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RouteTransition } from "@/components/motion/RouteTransition";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${brand.name} | ${brand.descriptor}`, template: `%s | ${brand.name}` },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: brand.name, title: `${brand.name} | ${brand.descriptor}`, description: brand.description, url: "/" },
  twitter: { card: "summary_large_image", title: brand.name, description: brand.description },
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#F3F0E8", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  url: siteUrl,
  description: brand.description,
  slogan: brand.descriptor,
  knowsAbout: ["Healthcare websites", "Patient-education films", "AI presenter video", "Social media content for clinicians", "Generative engine optimisation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <Header />
        {children}
        <SmoothScroll />
        <RouteTransition />
      </body>
    </html>
  );
}
