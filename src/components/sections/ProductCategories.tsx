"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Tag, ArrowUpRight, HelpCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

const categories = [
  {
    id: "office-chairs",
    title: "Office Chairs",
    desc: "Task chairs, visitor chairs, executive seating, and ergonomic office options.",
    image: "/office_chair.png",
    group: "seating",
    isClearance: true,
    priceNote: "Up to 20% off clear-out stock",
  },
  {
    id: "waiting-chairs",
    title: "Waiting Chairs",
    desc: "Durable waiting-area seating for hospitals, offices, banks, and institutions.",
    image: "/waiting_area.png",
    group: "seating",
    isClearance: false,
    priceNote: "Institutional volume pricing",
  },
  {
    id: "student-desk",
    title: "Student Desk & Bench",
    desc: "Practical seating and desk systems for classrooms, colleges, and training rooms.",
    image: "/classroom_hero.png",
    group: "desks",
    isClearance: true,
    priceNote: "Special institutional contracts",
  },
  {
    id: "lockers",
    title: "Lockers",
    desc: "Secure storage solutions for staff, students, employees, and facility users.",
    image: "/storage_lockers.png",
    group: "storage",
    isClearance: false,
    priceNote: "Custom configurations",
  },
  {
    id: "storage-cabinets",
    title: "Storage Cabinets",
    desc: "Organized storage for records, equipment, supplies, and administrative needs.",
    image: "/storage_lockers.png",
    group: "storage",
    isClearance: true,
    priceNote: "In-stock delivery",
  },
  {
    id: "office-tables",
    title: "Office Tables",
    desc: "Tables for offices, meeting rooms, administration counters, and staff desks.",
    image: "/office_chair.png",
    group: "desks",
    isClearance: false,
    priceNote: "Bulk custom dimensions",
  },
];

const filterTabs = [
  { id: "all", label: "All Products" },
  { id: "seating", label: "Seating Solutions" },
  { id: "desks", label: "Desks & Tables" },
  { id: "storage", label: "Storage & Lockers" },
];

interface ProductCategoriesProps {
  onRequestQuote: (category?: string) => void;
  showClearanceOnly: boolean;
  setShowClearanceOnly: (val: boolean) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  onRequestQuote,
  showClearanceOnly,
  setShowClearanceOnly,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || cat.group === activeTab;
      const matchesClearance = !showClearanceOnly || cat.isClearance;
      return matchesSearch && matchesTab && matchesClearance;
    });
  }, [searchQuery, activeTab, showClearanceOnly]);

  return (
    <section id="products" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
              Product Portfolio
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark-bg mt-2 tracking-tight">
              Furniture categories for every institutional space
            </h2>
            <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-light mt-4">
              From seating and desks to lockers and storage, Surya Industry helps organizations source the right fit for each environment.
            </p>
          </div>

          {/* Clearance Badge / Toggle */}
          <button
            onClick={() => setShowClearanceOnly(!showClearanceOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              showClearanceOnly
                ? "bg-brand-accent/15 border-brand-accent text-brand-accent"
                : "bg-brand-bg-warm border-brand-border text-brand-secondary hover:text-brand-dark-bg hover:border-neutral-400"
            }`}
          >
            <Tag size={13} className={showClearanceOnly ? "animate-bounce" : ""} />
            <span>Clearance Sale options available</span>
            <div className={`w-2 h-2 rounded-full ml-1 ${showClearanceOnly ? "bg-brand-accent" : "bg-neutral-300"}`} />
          </button>
        </div>

        {/* Filter Controls (Search + Tabs) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-8 mb-12 border-b border-brand-border">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-brand-dark-bg text-white"
                    : "bg-transparent text-brand-secondary hover:text-brand-dark-bg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-bg-warm border border-brand-border rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-neutral-400 outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat) => (
            <Card key={cat.id} className="flex flex-col h-full group p-5 md:p-5">
              {/* Product Image */}
              <div className="relative rounded-custom-md overflow-hidden bg-brand-bg-warm aspect-[16/10] border border-brand-border/40 shadow-soft-sm">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-w-768px) 100vw, 30vw"
                />
                
                {/* Clearance Tag Overlay */}
                {cat.isClearance && (
                  <div className="absolute top-3 left-3 bg-brand-accent text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-soft-sm">
                    Clearance Deal
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="flex-1 flex flex-col pt-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-lg text-brand-dark-bg group-hover:text-brand-accent transition-colors duration-200">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] text-brand-secondary font-medium tracking-wide border border-brand-border/60 rounded px-2 py-0.5 bg-brand-bg-warm">
                    {cat.priceNote}
                  </span>
                </div>
                <p className="text-sm text-brand-secondary leading-relaxed font-light mt-3 flex-1">
                  {cat.desc}
                </p>

                {/* Quote Button */}
                <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between">
                  <button
                    onClick={() => onRequestQuote(cat.title)}
                    className="text-xs font-semibold uppercase tracking-wider text-brand-accent group-hover:text-[#b5883d] transition-colors duration-200 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Request Quote
                    <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20 border border-dashed border-brand-border rounded-custom-lg bg-brand-bg-warm/10">
            <HelpCircle size={36} className="text-neutral-300 mx-auto mb-4" />
            <h4 className="font-display font-semibold text-base text-brand-dark-bg">No categories match search criteria</h4>
            <p className="text-xs text-brand-secondary mt-1 max-w-sm mx-auto">Try checking your search spelling, selecting another product category filter, or turning off the clearance toggle.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
                setShowClearanceOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </section>
  );
};
