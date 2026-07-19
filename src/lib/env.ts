import "server-only";

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

function clean(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized.startsWith("your_")) return null;
  return normalized;
}

export function getSupabasePublicConfig() {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

export function getSupabaseAdminConfig() {
  const publicConfig = getSupabasePublicConfig();
  const secretKey = clean(
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  if (!publicConfig || !secretKey) return null;
  return { ...publicConfig, secretKey };
}

export function requireSupabasePublicConfig() {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new ConfigurationError("Supabase public environment variables are not configured.");
  }
  return config;
}

export function requireSupabaseAdminConfig() {
  const config = getSupabaseAdminConfig();
  if (!config) {
    throw new ConfigurationError("Supabase server environment variables are not configured.");
  }
  return config;
}

export function getLeadSecurityConfig() {
  const fingerprintSalt = clean(process.env.LEAD_FINGERPRINT_SALT);
  if (!fingerprintSalt) {
    throw new ConfigurationError("LEAD_FINGERPRINT_SALT is not configured.");
  }
  return { fingerprintSalt };
}

export function getEmailConfig() {
  const apiKey = clean(process.env.RESEND_API_KEY);
  const from = clean(process.env.RESEND_FROM_EMAIL);
  const to = clean(process.env.LEADS_TO_EMAIL);
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}
