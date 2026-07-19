"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { mapProductRow, productInputToRow } from "@/lib/catalog";
import { getSupabaseAdminConfig } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { productInputSchema } from "@/lib/validation/catalog";
import type { ProductItem } from "@/types/catalog";

export interface LoginState {
  error: string;
}

export type ProductMutationResult =
  | { ok: true; product: ProductItem }
  | { ok: false; error: string };

export type MutationResult = { ok: true } | { ok: false; error: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
});

const productIdSchema = z.string().trim().min(1).max(180);
const productFlagsSchema = z
  .object({
    isAvailable: z.boolean().optional(),
    isVisible: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0);

function refreshCatalog() {
  revalidatePath("/", "layout");
  revalidatePath("/clearance");
  revalidatePath("/admin");
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return `${slug || "product"}-${randomBytes(3).toString("hex")}`;
}

function actionError(error: unknown) {
  console.error("Admin mutation failed", error);
  return "The change could not be saved. Please retry.";
}

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!getSupabaseAdminConfig()) {
    return { error: "The production backend has not been configured yet." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid admin email and password." };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "The email or password is incorrect." };

  try {
    await requireAdmin();
  } catch {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for the owner dashboard." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createProductAction(input: unknown): Promise<ProductMutationResult> {
  try {
    await requireAdmin();
    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Review the product fields and retry." };

    const supabase = createAdminSupabaseClient();
    const { data: lastProduct } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await supabase
      .from("products")
      .insert({
        id: slugify(parsed.data.title),
        ...productInputToRow(parsed.data),
        sort_order: (lastProduct?.sort_order ?? 0) + 10,
      })
      .select("*")
      .single();

    if (error) throw error;
    refreshCatalog();
    return { ok: true, product: mapProductRow(data) };
  } catch (error) {
    return { ok: false, error: actionError(error) };
  }
}

export async function updateProductAction(
  id: string,
  input: unknown
): Promise<ProductMutationResult> {
  try {
    await requireAdmin();
    const parsedId = productIdSchema.safeParse(id);
    const parsed = productInputSchema.safeParse(input);
    if (!parsedId.success || !parsed.success) {
      return { ok: false, error: "Review the product fields and retry." };
    }

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .update(productInputToRow(parsed.data))
      .eq("id", parsedId.data)
      .select("*")
      .single();

    if (error) throw error;
    refreshCatalog();
    return { ok: true, product: mapProductRow(data) };
  } catch (error) {
    return { ok: false, error: actionError(error) };
  }
}

export async function setProductFlagsAction(
  id: string,
  flags: unknown
): Promise<ProductMutationResult> {
  try {
    await requireAdmin();
    const parsedId = productIdSchema.safeParse(id);
    const parsedFlags = productFlagsSchema.safeParse(flags);
    if (!parsedId.success || !parsedFlags.success) {
      return { ok: false, error: "The product update was invalid." };
    }

    const update = {
      ...(parsedFlags.data.isAvailable === undefined
        ? {}
        : { is_available: parsedFlags.data.isAvailable }),
      ...(parsedFlags.data.isVisible === undefined
        ? {}
        : { is_visible: parsedFlags.data.isVisible }),
    };
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .update(update)
      .eq("id", parsedId.data)
      .select("*")
      .single();

    if (error) throw error;
    refreshCatalog();
    return { ok: true, product: mapProductRow(data) };
  } catch (error) {
    return { ok: false, error: actionError(error) };
  }
}

export async function deleteProductAction(id: string): Promise<MutationResult> {
  try {
    await requireAdmin();
    const parsedId = productIdSchema.safeParse(id);
    if (!parsedId.success) return { ok: false, error: "The product ID was invalid." };

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", parsedId.data);
    if (error) throw error;
    refreshCatalog();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: actionError(error) };
  }
}

export async function archiveLeadAction(
  kind: "quote" | "notification",
  id: string
): Promise<MutationResult> {
  try {
    await requireAdmin();
    const parsedId = z.string().uuid().safeParse(id);
    if (!parsedId.success) return { ok: false, error: "The lead ID was invalid." };

    const table = kind === "quote" ? "quote_requests" : "notify_requests";
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from(table)
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", parsedId.data);

    if (error) throw error;
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: actionError(error) };
  }
}
