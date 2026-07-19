import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/ProductPageView";
import { getPublicProduct, getPublicProducts } from "@/lib/catalog";
import { getProductStructuredData, serializeJsonLd } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProduct(id);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const description = `${product.desc} Factory-direct institutional supply in Bengaluru and across Karnataka.`;
  const canonicalPath = `/products/${encodeURIComponent(product.id)}`;

  return {
    title: product.title,
    description,
    keywords: [
      product.title,
      product.categoryName,
      `${product.categoryName} Bengaluru`,
      "institutional furniture supplier Karnataka",
      "Surya Industries",
    ],
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title: `${product.title} | Surya Industries`,
      description,
      url: canonicalPath,
      images: [{ url: product.image, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Surya Industries`,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getPublicProduct(id);
  if (!product) notFound();

  return (
    <>
      <script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(getProductStructuredData(product)),
        }}
      />
      <ProductPageView product={product} />
    </>
  );
}
