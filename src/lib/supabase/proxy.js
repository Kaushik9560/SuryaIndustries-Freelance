import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/env";
export async function updateSession(request) {
    const config = getSupabasePublicConfig();
    if (!config)
        return NextResponse.next({ request });
    let response = NextResponse.next({ request });
    const supabase = createServerClient(config.url, config.publishableKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet, headers) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
            },
        },
    });
    await supabase.auth.getClaims();
    return response;
}
