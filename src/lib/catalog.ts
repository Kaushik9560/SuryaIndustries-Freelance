import "server-only";

import { cache } from "react";
import { INITIAL_PRODUCTS } from "@/data/products";
import { getSupabasePublicConfig } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/lib/supabase/database.types";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { ProductInput, ProductItem, ProductSpec } from "@/types/catalog";
import type { NotifyLead, QuoteLead } from "@/types/leads";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type QuoteRow = Database["public"]["Tables"]["quote_requests"]["Row"];
type NotifyRow = Database["public"]["Tables"]["notify_requests"]["Row"];

function isProductSpec(value: unknown): value is ProductSpec {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    typeof value.label === "string" &&
    "value" in value &&
    typeof value.value === "string"
  );
}

export function mapProductRow(row: ProductRow): ProductItem {
  const specs: ProductSpec[] = Array.isArray(row.specs)
    ? row.specs.flatMap((spec) =>
        isProductSpec(spec) ? [{ label: spec.label, value: spec.value }] : []
      )
    : [];

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryName: row.category_name,
    desc: row.description,
    fullDesc: row.full_description,
    image: row.image_url,
    gallery: row.gallery.length > 0 ? row.gallery : [row.image_url],
    priceNote: row.price_note,
    features: row.features,
    specs,
    isAvailable: row.is_available,
    isVisible: row.is_visible,
    isBestseller: row.is_bestseller,
    isClearance: row.is_clearance,
    clearanceNote: row.clearance_note ?? undefined,
  };
}

export function productInputToRow(input: ProductInput) {
  return {
    title: input.title,
    category: input.category,
    category_name: input.categoryName,
    description: input.desc,
    full_description: input.fullDesc,
    image_url: input.image,
    gallery: input.gallery,
    price_note: input.priceNote,
    features: input.features,
    specs: input.specs as unknown as Json,
    is_available: input.isAvailable,
    is_visible: input.isVisible,
    is_bestseller: input.isBestseller ?? false,
    is_clearance: input.isClearance ?? false,
    clearance_note: input.isClearance ? input.clearanceNote || null : null,
  };
}

function mapQuoteRow(row: QuoteRow): QuoteLead {
  return {
    id: row.id,
    referenceCode: row.reference_code,
    categories: row.categories,
    industry: row.industry,
    quantity: row.quantity,
    timeline: row.timeline,
    contactName: row.contact_name,
    organization: row.organization,
    email: row.email,
    phone: row.phone,
    location: row.location,
    details: row.details ?? "",
    status: row.status,
    emailStatus: row.email_status,
    createdAt: row.created_at,
  };
}

function mapNotifyRow(row: NotifyRow): NotifyLead {
  return {
    id: row.id,
    referenceCode: row.reference_code,
    productId: row.product_id,
    productTitle: row.product_title,
    email: row.email,
    phone: row.phone ?? "",
    status: row.status,
    emailStatus: row.email_status,
    createdAt: row.created_at,
  };
}

export async function getPublicProducts(): Promise<ProductItem[]> {
  if (!getSupabasePublicConfig()) return INITIAL_PRODUCTS;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Unable to load the public product catalog", error.message);
    return INITIAL_PRODUCTS;
  }

  return data.map(mapProductRow);
}

export const getPublicProduct = cache(async (id: string): Promise<ProductItem | null> => {
  const fallback = INITIAL_PRODUCTS.find(
    (product) => product.id === id && product.isVisible !== false
  );
  if (!getSupabasePublicConfig()) return fallback ?? null;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .maybeSingle();

  if (error) {
    console.error("Unable to load the public product", error.message);
    return fallback ?? null;
  }

  return data ? mapProductRow(data) : null;
});

export async function getAdminDashboardData() {
  const supabase = createAdminSupabaseClient();
  const [productsResult, quotesResult, notificationsResult] = await Promise.all([
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("notify_requests").select("*").order("created_at", { ascending: false }),
  ]);

  const error = productsResult.error ?? quotesResult.error ?? notificationsResult.error;
  if (error) throw new Error(`Unable to load admin data: ${error.message}`);

  return {
    products: (productsResult.data ?? []).map(mapProductRow),
    quotes: (quotesResult.data ?? []).map(mapQuoteRow),
    notifications: (notificationsResult.data ?? []).map(mapNotifyRow),
  };
}
