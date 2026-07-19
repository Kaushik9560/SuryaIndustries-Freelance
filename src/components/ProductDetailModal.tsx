"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShieldCheck, CheckCircle2, ArrowUpRight, BellRing, MapPin } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "./ui/Button";
import { useModalAccessibility } from "@/hooks/useModalAccessibility";

interface ProductDetailModalProps {
  onRequestQuote: (productTitle: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ onRequestQuote }) => {
  const {
    selectedProduct,
    isDetailOpen,
    closeProductDetail,
    openNotifyModal,
    toggleWishlist,
    isInWishlist,
  } = useProducts();

  const [gallerySelection, setGallerySelection] = useState({ productId: "", index: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setGallerySelection({ productId: "", index: 0 });
    closeProductDetail();
  };

  useModalAccessibility({
    isOpen: isDetailOpen && Boolean(selectedProduct),
    onClose: handleClose,
    containerRef: dialogRef,
  });

  if (!selectedProduct) return null;

  const activeImageIdx =
    gallerySelection.productId === selectedProduct.id ? gallerySelection.index : 0;

  const images = selectedProduct.gallery && selectedProduct.gallery.length > 0
    ? selectedProduct.gallery
    : [selectedProduct.image];

  const currentImage = images[activeImageIdx] || selectedProduct.image;
  const isWishlisted = isInWishlist(selectedProduct.id);

  return (
    <AnimatePresence>
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-background border border-brand-border rounded-custom-xl shadow-soft-lg overflow-hidden my-auto z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/60 bg-brand-bg-warm/50">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest border border-brand-accent/30 rounded px-2 py-0.5 bg-brand-accent/10">
                  {selectedProduct.categoryName || selectedProduct.category}
                </span>
                {selectedProduct.isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Available for Supply
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Currently Unavailable
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-white border-brand-border text-brand-secondary hover:text-brand-dark-bg"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white border border-brand-border text-brand-dark-bg hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto p-6 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                {/* Large Main Image */}
                <div className="relative rounded-custom-lg overflow-hidden bg-brand-bg-warm border border-brand-border/60 aspect-[4/3] shadow-soft-sm group">
                  <Image
                    src={currentImage}
                    alt={selectedProduct.title}
                    fill
                    className="object-cover transition-all duration-300"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  {selectedProduct.priceNote && (
                    <div className="absolute top-3 left-3 bg-brand-dark-bg text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                      {selectedProduct.priceNote}
                    </div>
                  )}
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setGallerySelection({ productId: selectedProduct.id, index: idx })}
                        aria-label={`View image ${idx + 1} of ${images.length}`}
                        aria-pressed={activeImageIdx === idx}
                        className={`relative w-20 aspect-[4/3] rounded-custom-md overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-brand-bg-warm ${
                          activeImageIdx === idx
                            ? "border-brand-accent shadow-soft-sm scale-105"
                            : "border-brand-border/40 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Regional Manufacturing Badge */}
                <div className="p-4 rounded-custom-md bg-brand-bg-warm/40 border border-brand-border/60 flex items-center gap-3 text-xs text-brand-secondary">
                  <MapPin size={16} className="text-brand-accent shrink-0" />
                  <span>Manufactured at Peenya Industrial Area, Bengaluru. Delivered across Karnataka.</span>
                </div>
              </div>

              {/* Right Column: Details & Specs */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                <div>
                  <h2 id="product-detail-title" className="font-display font-bold text-2xl sm:text-3xl text-brand-dark-bg tracking-tight leading-snug">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-sm text-brand-secondary leading-relaxed font-light mt-3">
                    {selectedProduct.fullDesc || selectedProduct.desc}
                  </p>

                  {/* Features Checklist */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-brand-border/40">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg mb-3">
                        Key Engineering Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-secondary font-light">
                        {selectedProduct.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-brand-accent shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Specifications Table */}
                  {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-brand-border/40">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg mb-3">
                        Technical Specifications
                      </h4>
                      <div className="rounded-custom-md border border-brand-border/60 overflow-hidden divide-y divide-brand-border/40 text-xs bg-white">
                        {selectedProduct.specs.map((spec, i) => (
                          <div key={i} className="flex items-center justify-between px-3.5 py-2">
                            <span className="font-medium text-brand-secondary">{spec.label}</span>
                            <span className="font-semibold text-brand-dark-bg text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action CTA Bar */}
                <div className="pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {selectedProduct.isAvailable ? (
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => {
                        handleClose();
                        onRequestQuote(selectedProduct.title);
                      }}
                    >
                      Request Institutional Quote
                      <ArrowUpRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-amber-500/10 border-amber-500/30 text-amber-900 hover:bg-amber-500/20"
                      onClick={() => {
                        handleClose();
                        openNotifyModal(selectedProduct);
                      }}
                    >
                      <BellRing size={16} className="text-amber-700" />
                      Notify Me When Available
                    </Button>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-brand-secondary justify-center sm:justify-start">
                    <ShieldCheck size={16} className="text-brand-accent shrink-0" />
                    <span>2-Year Warranty Included</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
