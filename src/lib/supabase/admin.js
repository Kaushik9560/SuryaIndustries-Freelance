import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAdminConfig } from "@/lib/env";
export function createAdminSupabaseClient() {
    const { url, secretKey } = requireSupabaseAdminConfig();
    return createClient(url, secretKey, {
        auth: {
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false,
        },
    });
}
