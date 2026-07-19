import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Website and quotation terms for Surya Industries.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-bg-warm px-6 py-16 text-brand-dark-bg md:py-24">
      <article className="mx-auto max-w-3xl rounded-custom-xl border border-brand-border bg-white p-8 shadow-soft-sm md:p-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline">
          <ArrowLeft size={15} /> Back to website
        </Link>
        <p className="mt-10 text-[10px] font-semibold uppercase tracking-widest text-brand-accent">
          Last updated July 19, 2026
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">Terms of Service</h1>
        <div className="mt-8 space-y-7 text-sm leading-7 text-brand-secondary">
          <p>
            This website provides general information about Surya Industries products and enables organizations to request quotations or stock updates. Using the website does not by itself create a purchase contract.
          </p>
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-dark-bg">Quotations and availability</h2>
            <p className="mt-2">
              Product images, descriptions, availability, discount labels, and price notes are indicative. Final specifications, quantities, taxes, freight, installation, delivery dates, warranty terms, and payment terms will be stated in a formal quotation or order confirmation.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-dark-bg">Acceptable use</h2>
            <p className="mt-2">
              You must not misuse the website, submit fraudulent enquiries, attempt unauthorized admin access, interfere with service operation, or copy content in violation of applicable rights.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-dark-bg">Liability</h2>
            <p className="mt-2">
              We aim to keep website information accurate and available but do not guarantee uninterrupted access. To the extent permitted by law, purchase-related obligations are governed by the final written quotation and accepted order terms.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
