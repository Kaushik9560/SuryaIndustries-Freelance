import "server-only";

import { createHmac } from "node:crypto";
import { getLeadSecurityConfig } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const MAX_BODY_BYTES = 24_000;

export function isTrustedFormOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originHost = new URL(origin).host.toLowerCase();
    const requestHost = (
      request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? ""
    )
      .split(",")[0]
      .trim()
      .toLowerCase();
    let configuredHost: string | null = null;
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        configuredHost = new URL(process.env.NEXT_PUBLIC_SITE_URL).host.toLowerCase();
      } catch {
        configuredHost = null;
      }
    }

    return originHost === requestHost || originHost === configuredHost;
  } catch {
    return false;
  }
}

export async function readSmallJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredSize = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function requestFingerprint(request: Request, scope: string) {
  const { fingerprintSalt } = getLeadSecurityConfig();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 300) || "unknown";

  return createHmac("sha256", fingerprintSalt)
    .update(`${scope}|${address}|${userAgent}`)
    .digest("hex");
}

export async function consumeLeadRateLimit(request: Request, scope: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.rpc("consume_public_rate_limit", {
    p_fingerprint: requestFingerprint(request, scope),
    p_limit: 5,
    p_window_seconds: 15 * 60,
  });

  if (error) throw new Error(`Rate limit service failed: ${error.message}`);
  return data;
}

export function hasFilledHoneypot(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    "website" in value &&
    typeof value.website === "string" &&
    value.website.length > 0
  );
}
