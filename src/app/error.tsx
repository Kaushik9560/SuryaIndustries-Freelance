"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page rendering failed", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-brand-bg-warm px-6 py-20 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-custom-xl border border-brand-border bg-white p-10 text-center shadow-soft-sm">
        <AlertTriangle size={34} className="mx-auto text-brand-accent" />
        <h1 className="mt-5 font-display text-3xl font-bold text-brand-dark-bg">
          This page could not be loaded
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
          Your information is safe. Please retry, or return to the catalog if the problem continues.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" onClick={reset}>Try Again</Button>
          <Link href="/" className="inline-flex items-center justify-center rounded-pill border border-brand-border px-6 py-3 text-sm font-medium text-brand-dark-bg hover:bg-brand-bg-warm">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
