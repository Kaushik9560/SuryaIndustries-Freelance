import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-bg-warm px-6 py-20 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-custom-xl border border-brand-border bg-white p-10 text-center shadow-soft-sm">
        <SearchX size={34} className="mx-auto text-brand-accent" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-widest text-brand-accent">
          Error 404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark-bg">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
          The requested page may have moved or no longer exists.
        </p>
        <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-pill bg-brand-dark-bg px-7 py-3 text-sm font-medium text-white hover:bg-brand-accent">
          Return Home
        </Link>
      </div>
    </main>
  );
}
