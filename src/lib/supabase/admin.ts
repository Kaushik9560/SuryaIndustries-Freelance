import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAdminConfig } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export function createAdminSupabaseClient() {
  const { url, secretKey } = requireSupabaseAdminConfig();
  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
