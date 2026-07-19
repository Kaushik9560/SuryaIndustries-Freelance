# Surya Industries Website

Production-oriented catalog and institutional enquiry website built with Next.js 16, React 19, Tailwind CSS 4, Supabase, and Resend.

## Architecture

- Public catalog pages are server-rendered from Supabase, with the canonical seed catalog as a read-only fallback when no backend is configured locally.
- Wishlist and modal UI state remain browser-local through `ProductProvider`.
- Quote and restock requests are validated, rate-limited, deduplicated, and persisted by server Route Handlers.
- The owner dashboard uses Supabase Auth plus an explicit `admin_users` membership check on every server mutation.
- Authorized owners can upload product photos from desktop or mobile; the server validates and optimizes them before writing to Supabase Storage.
- Product, lead, and security tables are defined in `supabase/migrations` with row-level security enabled.

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the service values when backend behavior is needed. Without Supabase variables, public pages use the built-in catalog and the admin route displays a safe setup-required screen.

## Verification

```bash
npm run check
npm run build
```

## Production

Complete [the production setup guide](docs/PRODUCTION_SETUP.md), then deploy and run:

```bash
npm run start
```
