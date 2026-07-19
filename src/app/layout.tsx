import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/context/ProductContext";
import { getPublicProducts } from "@/lib/catalog";
import {
  getOrganizationStructuredData,
  getSiteUrl,
  serializeJsonLd,
} from "@/lib/seo";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Institutional Furniture Manufacturer Bengaluru | Surya Industries",
    template: "%s | Surya Industries",
  },
  description:
    "Factory-direct office chairs, student desks, waiting-area seating, lockers, and security safes for institutions across Bengaluru and Karnataka.",
  keywords: ["institutional furniture", "office chairs", "school desks", "student desk and bench", "metal lockers", "storage cabinets", "Surya Industries", "Karnataka"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Surya Industries",
    title: "Institutional Furniture Manufacturer Bengaluru | Surya Industries",
    description:
      "Factory-direct office seating, student desks, lockers, and safes for institutions across Bengaluru and Karnataka.",
    images: [{ url: "/classroom_hero.png", alt: "Surya Industries classroom furniture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Institutional Furniture Manufacturer Bengaluru | Surya Industries",
    description:
      "Factory-direct seating, desks, lockers, safes, and storage for Karnataka institutions.",
    images: ["/classroom_hero.png"],
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
};

export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getPublicProducts();
  const organizationStructuredData = getOrganizationStructuredData();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationStructuredData),
          }}
        />
        <ProductProvider products={products}>
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}
