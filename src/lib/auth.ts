import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export class AuthorizationError extends Error {
  constructor(message = "Administrator access is required.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export interface CurrentAdmin {
  id: string;
  email: string;
  displayName: string;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const authClient = await createServerSupabaseClient();
  const { data, error } = await authClient.auth.getClaims();
  const subject = data?.claims?.sub;
  if (error || !subject) return null;

  const adminClient = createAdminSupabaseClient();
  const { data: admin, error: adminError } = await adminClient
    .from("admin_users")
    .select("user_id, email, display_name, is_active")
    .eq("user_id", subject)
    .eq("is_active", true)
    .maybeSingle();

  if (adminError) throw new Error(`Unable to verify administrator: ${adminError.message}`);
  if (!admin) return null;

  return {
    id: admin.user_id,
    email: admin.email,
    displayName: admin.display_name || admin.email,
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new AuthorizationError();
  return admin;
}
