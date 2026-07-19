import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requireSupabasePublicConfig } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export function createPublicSupabaseClient() {
  const { url, publishableKey } = requireSupabasePublicConfig();
  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
