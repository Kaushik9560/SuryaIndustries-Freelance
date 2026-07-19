import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Surya Industries handles website enquiry and contact information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-bg-warm px-6 py-16 text-brand-dark-bg md:py-24">
      <article className="mx-auto max-w-3xl rounded-custom-xl border border-brand-border bg-white p-8 shadow-soft-sm md:p-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline">
          <ArrowLeft size={15} /> Back to website
        </Link>
        <p className="mt-10 text-[10px] font-semibold uppercase tracking-widest text-brand-accent">
          Last updated July 19, 2026
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">Privacy Policy</h1>
        <div className="mt-8 space-y-7 text-sm leading-7 text-brand-secondary">
          <p>
            Surya Industries collects the information you submit through quotation and stock-notification forms, including contact details, organization, location, and purchasing requirements. We use it only to respond to your enquiry, prepare proposals, coordinate supply, and maintain business records.
          </p>
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-dark-bg">Storage and service providers</h2>
            <p className="mt-2">
              Enquiries are stored in our secured database and may be transmitted through our email delivery provider to alert authorized staff. Access is restricted to approved administrators. We do not sell enquiry information.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-dark-bg">Retention and your choices</h2>
            <p className="mt-2">
              We retain enquiry records only as long as reasonably needed for sales follow-up, legal obligations, and dispute prevention. You may ask us to correct or delete your contact information, subject to records we must retain by law.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-dark-bg">Contact</h2>
            <p className="mt-2">
              {SITE_CONFIG.contactEmail
                ? `For privacy requests, email ${SITE_CONFIG.contactEmail}.`
                : "For privacy requests, submit a quotation form and state that your message concerns privacy."}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
