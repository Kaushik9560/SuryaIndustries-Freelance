import { z } from "zod";

const PRODUCT_IMAGE_STORAGE_PATH = "/storage/v1/object/public/product-images/";

function isAllowedProductImageSource(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    const configuredOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : null;
    const isSupabaseHost =
      url.hostname.endsWith(".supabase.co") || url.origin === configuredOrigin;

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      isSupabaseHost &&
      url.pathname.startsWith(PRODUCT_IMAGE_STORAGE_PATH)
    );
  } catch {
    return false;
  }
}

const imageSourceSchema = z
  .string()
  .trim()
  .min(1, "A product image is required")
  .max(1000)
  .refine(
    isAllowedProductImageSource,
    "Upload an image or use a deployed product image path"
  );

export const productInputSchema = z
  .object({
    title: z.string().trim().min(2).max(160),
    category: z.enum(["seating", "desks", "storage"]),
    categoryName: z.string().trim().min(2).max(120),
    desc: z.string().trim().min(10).max(300),
    fullDesc: z.string().trim().min(10).max(3000),
    image: imageSourceSchema,
    gallery: z.array(imageSourceSchema).min(1).max(12),
    priceNote: z.string().trim().min(2).max(100),
    features: z.array(z.string().trim().min(2).max(240)).max(20),
    specs: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(80),
          value: z.string().trim().min(1).max(240),
        })
      )
      .max(20),
    isAvailable: z.boolean(),
    isVisible: z.boolean(),
    isBestseller: z.boolean().optional().default(false),
    isClearance: z.boolean().optional().default(false),
    clearanceNote: z.string().trim().max(120).optional().default(""),
  })
  .refine((product) => !product.isClearance || product.clearanceNote.length >= 2, {
    message: "Clearance products require a discount label",
    path: ["clearanceNote"],
  });

export type ValidatedProductInput = z.infer<typeof productInputSchema>;
