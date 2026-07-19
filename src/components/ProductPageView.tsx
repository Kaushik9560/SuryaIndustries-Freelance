"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Check,
  Heart,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { NotifyModal } from "@/components/NotifyModal";
import { QuoteModal } from "@/components/QuoteModal";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/context/ProductContext";
import type { ProductItem } from "@/types/catalog";

interface ProductPageViewProps {
  product: ProductItem;
}

export function ProductPageView({ product }: ProductPageViewProps) {
  const { isInWishlist, openNotifyModal, toggleWishlist } = useProducts();
  const [activeImage, setActiveImage] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSession, setQuoteSession] = useState(0);
  const images = Array.from(new Set([product.image, ...product.gallery]));
  const isWishlisted = isInWishlist(product.id);

  const openQuote = () => {
    setQuoteSession((current) => current + 1);
    setQuoteOpen(true);
  };

  return (
    <>
      <Header onRequestQuote={openQuote} />

      <main className="flex-1 bg-brand-bg-warm/20 pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-brand-secondary">
            <Link href="/" className="transition-colors hover:text-brand-accent">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/#products" className="transition-colors hover:text-brand-accent">
              Products
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-dark-bg">{product.title}</span>
          </nav>

          <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-custom-xl border border-brand-border bg-white shadow-soft-md">
                <Image
                  src={images[activeImage] || product.image}
                  alt={`${product.title} product view ${activeImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-3 sm:p-6"
                />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white ${product.isAvailable ? "bg-emerald-700" : "bg-amber-700"}`}>
                  {product.isAvailable ? "Available for supply" : "Currently unavailable"}
                </span>
              </div>

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show ${product.title} image ${index + 1}`}
                      aria-pressed={activeImage === index}
                      className={`relative aspect-square overflow-hidden rounded-custom-md border bg-white transition-colors cursor-pointer ${activeImage === index ? "border-brand-accent ring-2 ring-brand-accent/20" : "border-brand-border hover:border-neutral-400"}`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-custom-xl border border-brand-border bg-white p-7 shadow-soft-sm md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-brand-accent">
                  {product.categoryName || product.category}
                </span>
                {product.isBestseller && (
                  <span className="rounded-full bg-brand-dark-bg px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-white">
                    Bestseller
                  </span>
                )}
                {product.isClearance && (
                  <span className="rounded-full bg-rose-600 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-white">
                    Clearance
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-brand-dark-bg md:text-5xl">
                {product.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-brand-secondary">
                {product.fullDesc || product.desc}
              </p>

              <div className="mt-7 rounded-custom-md border border-brand-accent/20 bg-brand-accent/5 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-brand-accent">
                  Institutional pricing
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-brand-dark-bg">
                  {product.clearanceNote || product.priceNote || "Request a volume quotation"}
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => product.isAvailable ? openQuote() : openNotifyModal(product)}
                >
                  {product.isAvailable ? <PackageCheck size={17} /> : <BellRing size={17} />}
                  {product.isAvailable ? "Request product quote" : "Notify when available"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  aria-pressed={isWishlisted}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                  className="gap-2"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart size={17} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
                  {isWishlisted ? "Saved" : "Save"}
                </Button>
              </div>

              <div className="mt-8 grid gap-3 border-t border-brand-border pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-custom-md bg-brand-bg-warm/60 p-3.5">
                  <ShieldCheck size={17} className="mt-0.5 shrink-0 text-brand-accent" />
                  <div>
                    <p className="text-xs font-semibold text-brand-dark-bg">Institutional support</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-brand-secondary">Quotation, delivery, installation, and after-sales assistance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-custom-md bg-brand-bg-warm/60 p-3.5">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-brand-accent" />
                  <div>
                    <p className="text-xs font-semibold text-brand-dark-bg">Karnataka supply</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-brand-secondary">Serving Bengaluru and institutional buyers across the state.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="rounded-custom-xl border border-brand-border bg-white p-7 shadow-soft-sm md:p-9">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                Product highlights
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-brand-dark-bg">
                Built for demanding institutional use
              </h2>
              {product.features.length ? (
                <ul className="mt-6 space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-brand-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                        <Check size={12} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm text-brand-secondary">Detailed configuration options are available with your quotation.</p>
              )}
            </article>

            <article className="rounded-custom-xl border border-brand-border bg-white p-7 shadow-soft-sm md:p-9">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                Technical details
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-brand-dark-bg">
                Product specifications
              </h2>
              {product.specs.length ? (
                <dl className="mt-6 divide-y divide-brand-border">
                  {product.specs.map((spec) => (
                    <div key={`${spec.label}-${spec.value}`} className="grid gap-1 py-3.5 sm:grid-cols-[0.42fr_0.58fr] sm:gap-5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                        {spec.label}
                      </dt>
                      <dd className="text-sm font-medium text-brand-dark-bg">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-5 text-sm text-brand-secondary">Specifications can be finalized for your project quantity and installation requirements.</p>
              )}
            </article>
          </section>

          <section className="mt-12 flex flex-col items-start justify-between gap-6 rounded-custom-xl bg-[#111111] p-8 text-white shadow-soft-lg md:flex-row md:items-center md:p-12">
            <div className="max-w-2xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                Planning a bulk requirement?
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold">
                Get specifications, lead time, and institutional pricing
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Share the quantity, delivery location, and expected timeline. The Surya Industries team will prepare a requirement-specific quotation.
              </p>
            </div>
            <Button variant="accent" size="lg" className="shrink-0" onClick={openQuote}>
              Request quotation
            </Button>
          </section>

          <Link
            href="/#products"
            className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-secondary transition-colors hover:text-brand-accent"
          >
            <ArrowLeft size={14} /> Back to product catalog
          </Link>
        </div>
      </main>

      <Footer />

      <QuoteModal
        key={quoteSession}
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        preselectedCategory={product.title}
      />
      <NotifyModal />
    </>
  );
}
