# Production Setup

The application is ready for a Vercel + Supabase + Resend deployment. External accounts and secrets are intentionally not embedded in the repository.

## 1. Supabase

1. Create a Supabase project in the preferred India-adjacent region.
2. Open the SQL editor and run the files in `supabase/migrations` in filename order. The first creates the production schema; the second creates the restricted `product-images` Storage bucket used by the owner upload flow.
3. In Authentication, create the owner user with a strong unique password and confirm the email.
4. Authorize that user once in the SQL editor, replacing the email:

```sql
insert into public.admin_users (user_id, email, display_name)
select id, email, 'Owner'
from auth.users
where email = 'owner@your-domain.example';
```

5. Copy the project URL, publishable key, and server secret key into the corresponding deployment variables from `.env.example`.
6. Never expose `SUPABASE_SECRET_KEY` in a browser variable or commit it to Git.

## 2. Lead Security

Generate a private fingerprint salt and set `LEAD_FINGERPRINT_SALT`:

```bash
openssl rand -hex 32
```

This value HMAC-hashes request fingerprints before the database rate limiter sees them. Rotate it only when existing rate-limit windows can safely reset.

## 3. Email

1. Add and verify a sending domain in Resend.
2. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEADS_TO_EMAIL`.
3. If email is temporarily unconfigured or unavailable, leads still persist in Supabase and remain visible in `/admin`; each record tracks delivery status.

## 4. Public Business Details

Set the `NEXT_PUBLIC_CONTACT_*` and social URL variables. Placeholder values are deliberately hidden by the application, so unverified phone numbers and social links cannot appear publicly.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before building. This controls canonical metadata, same-origin lead protection, robots, and sitemap URLs.

## 5. Deploy and Verify

Run locally before deployment:

```bash
npm ci
npm run check
npm run build
```

After deployment, verify:

1. `/`, `/clearance`, `/privacy`, `/terms`, `/robots.txt`, and `/sitemap.xml` return successfully.
2. A test quote appears in `/admin` and reaches the configured owner email.
3. A restock request appears in `/admin` with the correct product.
4. An unauthorized Supabase user cannot access the dashboard.
5. Product edits become visible on public pages after refresh.
6. A JPG, PNG, or WebP selected in the product editor uploads successfully and remains visible after refresh.
7. Response headers include CSP, HSTS, frame protection, and `no-store` on `/admin`.

## 6. Operations

- Enable Supabase backups and review Auth/database logs.
- Configure Vercel deployment alerts and an external uptime monitor.
- Review and archive leads from the dashboard; do not delete database records casually.
- Have business counsel review the privacy and terms pages before launch.
- Rotate keys immediately if any server secret is exposed.
