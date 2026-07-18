"use client";

import React, { useState } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { DecisionMakers } from "@/components/sections/DecisionMakers";
import { ProductCategories } from "@/components/sections/ProductCategories";
import { PartnerSection } from "@/components/sections/PartnerSection";
import { ProcurementProcess } from "@/components/sections/ProcurementProcess";
import { WarrantyCallout } from "@/components/sections/WarrantyCallout";
import { GallerySection } from "@/components/sections/GallerySection";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { Footer } from "@/components/sections/Footer";
import { QuoteModal } from "@/components/QuoteModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState("");
  const [showClearanceOnly, setShowClearanceOnly] = useState(false);

  const handleOpenModal = (category?: string) => {
    if (category && typeof category === "string") {
      setPreselectedCategory(category);
    } else {
      setPreselectedCategory("");
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPreselectedCategory("");
  };

  const handleSelectClearance = () => {
    setShowClearanceOnly(true);
    // Smooth scroll to the products section
    const target = document.querySelector("#products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Premium Sticky Navigation */}
      <Header
        onRequestQuote={() => handleOpenModal()}
        onSelectSale={handleSelectClearance}
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
          showClearanceOnly={showClearanceOnly}
          setShowClearanceOnly={setShowClearanceOnly}
        />

        {/* Partner capabilities and core strengths */}
        <PartnerSection />

        {/* Clear process timelines */}
        <ProcurementProcess />

        {/* Warranty callout block */}
        <WarrantyCallout />

        {/* Installation gallery filterable by space */}
        <GallerySection />

        {/* Direct quotation call-to-action */}
        <QuoteCTA onRequestQuote={() => handleOpenModal()} />
      </main>

      {/* Global institutional footer */}
      <Footer />

      {/* Interactive Quotation Form Modal */}
      <QuoteModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        preselectedCategory={preselectedCategory}
      />
    </>
  );
}
