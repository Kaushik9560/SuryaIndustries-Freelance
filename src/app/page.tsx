"use client";

import React, { useState } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { DecisionMakers } from "@/components/sections/DecisionMakers";
import { ProductCategories } from "@/components/sections/ProductCategories";
import { ManufacturingExcellence } from "@/components/sections/ManufacturingExcellence";
import { ProcurementProcess } from "@/components/sections/ProcurementProcess";
import { WarrantyCallout } from "@/components/sections/WarrantyCallout";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { Footer } from "@/components/sections/Footer";
import { QuoteModal } from "@/components/QuoteModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { NotifyModal } from "@/components/NotifyModal";

export default function Home() {
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

  return (
    <>
      {/* Premium Sticky Navigation */}
      <Header
        onRequestQuote={() => handleOpenModal()}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onRequestQuote={() => handleOpenModal()} />

        {/* Built for institutional decision makers */}
        <DecisionMakers />

        {/* Interactive Product Category Showcase */}
        <ProductCategories
          onRequestQuote={handleOpenModal}
        />

        {/* Manufacturing Excellence & Quality Assurance */}
        <ManufacturingExcellence onRequestQuote={() => handleOpenModal()} />

        {/* Clear process timelines */}
        <ProcurementProcess />

        {/* Warranty callout block */}
        <WarrantyCallout />

        {/* Direct quotation call-to-action */}
        <QuoteCTA onRequestQuote={() => handleOpenModal()} />
      </main>

      {/* Global institutional footer */}
      <Footer />

      {/* Interactive Quotation Form Modal */}
      <QuoteModal
        key={quoteSession}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        preselectedCategory={preselectedCategory}
      />

      {/* Product Detail & Photo Gallery Modal */}
      <ProductDetailModal onRequestQuote={handleOpenModal} />

      {/* Stock Restock Interest Notification Modal */}
      <NotifyModal />
    </>
  );
}
