import { describe, expect, it } from "vitest";
import { INITIAL_PRODUCTS } from "@/data/products";
import { productInputSchema } from "@/lib/validation/catalog";
import { notifyRequestSchema, quoteRequestSchema } from "@/lib/validation/leads";
import type { ProductItem } from "@/types/catalog";

const idempotencyKey = "1c905f6a-8f69-4eb0-b991-0c348d8f7364";

function withoutId(product: ProductItem) {
  const input: Partial<ProductItem> = { ...product };
  delete input.id;
  return input;
}

describe("catalog validation", () => {
  it("accepts every canonical seed product", () => {
    for (const product of INITIAL_PRODUCTS) {
      expect(productInputSchema.safeParse(withoutId(product)).success).toBe(true);
    }
  });

  it("rejects unsafe image protocols", () => {
    const product = withoutId(INITIAL_PRODUCTS[0]);
    expect(
      productInputSchema.safeParse({ ...product, image: "javascript:alert(1)" }).success
    ).toBe(false);
  });

  it("accepts product images from the managed Supabase Storage bucket", () => {
    const product = withoutId(INITIAL_PRODUCTS[0]);
    const storageImage =
      "https://project.supabase.co/storage/v1/object/public/product-images/catalog/item.webp";
    expect(
      productInputSchema.safeParse({
        ...product,
        image: storageImage,
        gallery: [storageImage],
      }).success
    ).toBe(true);
  });

  it("rejects unrelated remote image hosts", () => {
    const product = withoutId(INITIAL_PRODUCTS[0]);
    expect(
      productInputSchema.safeParse({
        ...product,
        image: "https://images.example.com/product.webp",
      }).success
    ).toBe(false);
  });

  it("requires a label when a product is on clearance", () => {
    const product = withoutId(INITIAL_PRODUCTS[1]);
    expect(
      productInputSchema.safeParse({
        ...product,
        isClearance: true,
        clearanceNote: "",
      }).success
    ).toBe(false);
  });
});

describe("lead validation", () => {
  it("normalizes and accepts a complete quote request", () => {
    const result = quoteRequestSchema.safeParse({
      categories: ["Office Chairs"],
      industry: "Corporate",
      quantity: "10-50",
      timeline: "1-3 Months",
      name: "  Anand Kumar  ",
      organization: "Surya Test Office",
      email: "BUYER@EXAMPLE.COM",
      phone: "+91 98765 43210",
      location: "Bengaluru",
      details: "Need installation support",
      sourcePath: "/clearance",
      idempotencyKey,
      website: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Anand Kumar");
      expect(result.data.email).toBe("buyer@example.com");
    }
  });

  it("rejects malformed public lead fields", () => {
    expect(
      notifyRequestSchema.safeParse({
        productId: "red-coffer-safe",
        productTitle: "Red Coffer Premium Vault Safe",
        email: "not-an-email",
        phone: "123",
        idempotencyKey,
        website: "",
      }).success
    ).toBe(false);
  });

  it("rejects a filled bot honeypot", () => {
    expect(
      notifyRequestSchema.safeParse({
        productId: "red-coffer-safe",
        productTitle: "Red Coffer Premium Vault Safe",
        email: "buyer@example.com",
        phone: "",
        idempotencyKey,
        website: "https://spam.example",
      }).success
    ).toBe(false);
  });
});
