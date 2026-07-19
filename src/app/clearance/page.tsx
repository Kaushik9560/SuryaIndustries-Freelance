"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck, Tag, Info } from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Card } from "@/components/ui/Card";
import { QuoteModal } from "@/components/QuoteModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { NotifyModal } from "@/components/NotifyModal";
import { useProducts } from "@/context/ProductContext";

export default function ClearancePage() {
  const { products, openProductDetail, openNotifyModal } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState("");
  const [quoteSession, setQuoteSession] = useState(0);

  const handleOpenModal = (category?: string) => {
    if (category && typeof category === "string") {
      setPreselectedCategory(category);
    } else {
      setPreselectedCategory("");
    }
    setQuoteSession((current) => current + 1);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPreselectedCategory("");
  };

  const clearanceProducts = products.filter(
    (product) => product.isClearance && product.isVisible !== false
  );

  return (
    <>
      <Header onRequestQuote={() => handleOpenModal()} />

      <main className="flex-1 pt-32 pb-20 md:pt-40 md:pb-28 bg-[#F7F3ED]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-secondary hover:text-brand-accent transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          {/* Page Hero Banner */}
          <div className="relative rounded-custom-xl overflow-hidden bg-[#111111] text-white p-8 md:p-16 border border-neutral-800 shadow-soft-lg mb-16">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-brand-accent/5 rounded-full blur-[100px] -z-10" />
            <div className="max-w-2xl flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-[10px] font-semibold uppercase tracking-wider">
                <Tag size={10} />
                Special Stock Clearance
              </span>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
                Clearance Sale
              </h1>
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-light mt-2">
                Get premium-grade, heavy-duty institutional furniture at direct warehouse clear-out discounts. Suitable for schools, offices, clinics, and banks seeking high quality on a restricted budget.
              </p>
              <div className="flex flex-wrap gap-4 items-center mt-6 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-brand-accent" />
                  Full 2-Year Warranty Included
                </span>
                <span className="flex items-center gap-1.5">
                  <Info size={14} className="text-brand-accent" />
                  Subject to Stock Availability
                </span>
              </div>
            </div>
          </div>

          {/* Clearance Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clearanceProducts.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col sm:flex-row gap-6 p-6 group h-full border border-brand-border/60 cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                
                {/* Product Image */}
                <div className="relative rounded-custom-md overflow-hidden bg-brand-bg-warm aspect-[4/3] sm:w-48 shrink-0 border border-brand-border/40 shadow-soft-sm">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 15vw"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-brand-accent text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-soft-sm">
                    Clearance
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                      <div>
                        <span className="text-[9px] text-brand-accent font-semibold uppercase tracking-wider block mb-1">
                          {product.categoryName}
                        </span>
                        <h3 className="font-display font-semibold text-lg text-brand-dark-bg group-hover:text-brand-accent transition-colors duration-200">
                          {product.title}
                        </h3>
                      </div>
                      <span className="text-[10px] text-brand-accent font-bold tracking-wide border border-brand-accent/30 rounded px-2.5 py-1 bg-brand-accent/5 whitespace-nowrap">
                        {product.clearanceNote || product.priceNote}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-brand-secondary leading-relaxed font-light mt-3">
                      {product.desc}
                    </p>
                  </div>

                  {/* CTA Request Quote */}
                  <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                      {product.isAvailable ? "Available for supply" : "Currently unavailable"}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (product.isAvailable) {
                          handleOpenModal(`Clearance: ${product.title}`);
                        } else {
                          openNotifyModal(product);
                        }
                      }}
                      className="text-xs font-semibold uppercase tracking-wider text-brand-accent group-hover:text-[#b5883d] transition-colors duration-200 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {product.isAvailable ? "Request Quote" : "Notify Me"}
                      <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {clearanceProducts.length === 0 && (
            <div className="rounded-custom-lg border border-dashed border-brand-border bg-white p-12 text-center">
              <Tag size={28} className="mx-auto text-brand-accent mb-3" />
              <h2 className="font-display font-semibold text-lg text-brand-dark-bg">
                No clearance batches are active right now
              </h2>
              <p className="text-sm text-brand-secondary mt-2">
                Please check back later or request a regular institutional quotation.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />

      <QuoteModal
        key={quoteSession}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        preselectedCategory={preselectedCategory}
      />

      <ProductDetailModal onRequestQuote={handleOpenModal} />
      <NotifyModal />
    </>
  );
}
