import "server-only";

import { SITE_CONFIG } from "@/config/site";
import type { ProductItem } from "@/types/catalog";

const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return LOCAL_SITE_URL;

  try {
    return new URL(configured).origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}

export function absoluteSiteUrl(path: string) {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function getOrganizationStructuredData() {
  const siteUrl = getSiteUrl();
  const sameAs = [SITE_CONFIG.linkedinUrl, SITE_CONFIG.facebookUrl].filter(
    (value): value is string => Boolean(value)
  );
  const contactPoint = SITE_CONFIG.contactPhone || SITE_CONFIG.contactEmail
    ? {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE_CONFIG.contactPhone || undefined,
        email: SITE_CONFIG.contactEmail || undefined,
        areaServed: "IN-KA",
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Surya Industries",
    url: siteUrl,
    description:
      "Institutional furniture supplier for offices, schools, hospitals, banks, and government organizations across Karnataka.",
    telephone: SITE_CONFIG.contactPhone || undefined,
    email: SITE_CONFIG.contactEmail || undefined,
    contactPoint,
    areaServed: {
      "@type": "State",
      name: "Karnataka",
    },
    knowsAbout: [
      "Institutional furniture",
      "Office seating",
      "Student desks",
      "Waiting area seating",
      "Steel lockers",
      "Security safes",
    ],
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function getProductStructuredData(product: ProductItem) {
  const productUrl = absoluteSiteUrl(`/products/${encodeURIComponent(product.id)}`);
  const images = Array.from(new Set([product.image, ...product.gallery])).map(absoluteSiteUrl);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: getSiteUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: absoluteSiteUrl("/#products"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: productUrl,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.title,
        url: productUrl,
        image: images,
        description: product.fullDesc || product.desc,
        sku: product.id,
        category: product.categoryName,
        brand: {
          "@type": "Brand",
          name: "Surya Industries",
        },
        manufacturer: {
          "@id": `${getSiteUrl()}/#organization`,
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Supply status",
            value: product.isAvailable ? "Available for institutional supply" : "Currently unavailable",
          },
          ...product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          })),
        ],
      },
    ],
  };
}
