import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireSupabasePublicConfig } from "@/lib/env";
export function createPublicSupabaseClient() {
    const { url, publishableKey } = requireSupabasePublicConfig();
    return createClient(url, publishableKey, {
        auth: {
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false,
        },
    });
}
