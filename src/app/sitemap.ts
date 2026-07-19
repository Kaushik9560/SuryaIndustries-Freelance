import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const products = await getPublicProducts();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}/clearance`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${encodeURIComponent(product.id)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.isBestseller ? 0.9 : 0.8,
    images: Array.from(new Set([product.image, ...product.gallery])).map((image) =>
      new URL(image, `${baseUrl}/`).toString()
    ),
  }));

  return [...staticPages, ...productPages];
}
