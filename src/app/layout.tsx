import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/context/ProductContext";
import { getPublicProducts } from "@/lib/catalog";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Surya Industries | Institutional Furniture Solutions",
    template: "%s | Surya Industries",
  },
  description: "Factory-direct institutional seating, student desks, lockers, safes, and storage solutions for organizations across Karnataka.",
  keywords: ["institutional furniture", "office chairs", "school desks", "student desk and bench", "metal lockers", "storage cabinets", "Surya Industries", "Karnataka"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Surya Industries",
    title: "Surya Industries | Institutional Furniture Solutions",
    description:
      "Factory-direct seating, desks, lockers, safes, and storage for Karnataka institutions.",
    images: [{ url: "/classroom_hero.png", alt: "Surya Industries classroom furniture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Surya Industries | Institutional Furniture Solutions",
    description:
      "Factory-direct seating, desks, lockers, safes, and storage for Karnataka institutions.",
    images: ["/classroom_hero.png"],
  },
};

export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getPublicProducts();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ProductProvider products={products}>
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}
