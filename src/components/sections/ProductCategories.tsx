"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, HelpCircle, Heart, Eye } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useProducts } from "@/context/ProductContext";

const filterTabs = [
  { id: "all", label: "All Products" },
  { id: "seating", label: "Seating Solutions" },
  { id: "desks", label: "Student Desks & Tables" },
  { id: "storage", label: "Safes, Lockers & Storage" },
];

interface ProductCategoriesProps {
  onRequestQuote: (category?: string) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  onRequestQuote,
}) => {
  const { products, openProductDetail, toggleWishlist, isInWishlist } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const visibleProducts = useMemo(() => {
    return products.filter((p) => p.isVisible !== false);
  }, [products]);

  const filteredCategories = useMemo(() => {
    return visibleProducts.filter((cat) => {
      const matchesSearch =
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || cat.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [visibleProducts, searchQuery, activeTab]);

  const bestsellers = useMemo(() => {
    return visibleProducts.filter((p) => p.isBestseller);
  }, [visibleProducts]);

  return (
    <section id="products" className="py-20 md:py-28 bg-background font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Title and Controls */}
        <div className="mb-16">
          <div className="max-w-xl">
            <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
              Product Portfolio
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark-bg mt-2 tracking-tight">
              Furniture categories for every institutional space
            </h2>
            <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-light mt-4">
              From ergonomic seating and student desks to heavy-duty security safes, click any product card to view full technical specifications and photo gallery.
            </p>
          </div>
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-bg-warm border border-brand-border rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-neutral-400 outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat) => {
            const isWishlisted = isInWishlist(cat.id);
            return (
              <Card
                key={cat.id}
                className="flex flex-col h-full group p-5 md:p-5 relative cursor-pointer hover:border-brand-accent/50 transition-all duration-300"
                onClick={() => openProductDetail(cat)}
              >
                {/* Product Image */}
                <div className="relative rounded-custom-md overflow-hidden bg-brand-bg-warm aspect-[16/10] border border-brand-border/40 shadow-soft-sm">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                  {/* Availability badge */}
                  <div className="absolute top-2.5 left-2.5">
                    {cat.isAvailable ? (
                      <span className="bg-green-700/90 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-amber-700/90 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(cat.id);
                    }}
                    aria-label="Save to Wishlist"
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur shadow-md transition-all cursor-pointer ${
                      isWishlisted
                        ? "bg-white text-rose-600 border border-rose-200"
                        : "bg-white/80 text-brand-dark-bg hover:bg-white"
                    }`}
                  >
                    <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
                  </button>
                </div>

                {/* Card Details */}
                <div className="flex-1 flex flex-col pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${encodeURIComponent(cat.id)}`}
                      onClick={(event) => event.stopPropagation()}
                      className="font-display font-semibold text-lg text-brand-dark-bg group-hover:text-brand-accent transition-colors duration-200"
                    >
                      {cat.title}
                    </Link>
                  </div>
                  <p className="text-sm text-brand-secondary leading-relaxed font-light mt-3 flex-1 line-clamp-2">
                    {cat.desc}
                  </p>

                  {/* Action Bar */}
                  <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between">
                    <Link
                      href={`/products/${encodeURIComponent(cat.id)}`}
                      onClick={(event) => event.stopPropagation()}
                      className="text-xs font-semibold uppercase tracking-wider text-brand-accent group-hover:text-[#b5883d] transition-colors duration-200 inline-flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      View Details & Specs
                    </Link>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestQuote(cat.title);
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded bg-brand-dark-bg text-white hover:bg-brand-accent transition-colors cursor-pointer"
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20 border border-dashed border-brand-border rounded-custom-lg bg-brand-bg-warm/10">
            <HelpCircle size={36} className="text-neutral-300 mx-auto mb-4" />
            <h4 className="font-display font-semibold text-base text-brand-dark-bg">No products match search criteria</h4>
            <p className="text-xs text-brand-secondary mt-1 max-w-sm mx-auto">Try checking your search spelling or selecting another product category filter.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Bestseller Row */}
        {bestsellers.length > 0 && (
          <div className="mt-20 pt-16 border-t border-brand-border">
            <div className="mb-10 text-left">
              <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
                Customer Favorites
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-brand-dark-bg mt-2 tracking-tight">
                Bestselling Products
              </h3>
              <p className="text-sm text-brand-secondary mt-2 font-light">
                Our most popular, highly demanded institutional furniture options.
              </p>
            </div>
            {/* Grid of Bestsellers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((item) => {
                const isWishlisted = isInWishlist(item.id);
                return (
                  <Card
                    key={item.id}
                    className="flex flex-col h-full group p-4 cursor-pointer hover:border-brand-accent/50 transition-all duration-300"
                    onClick={() => openProductDetail(item)}
                  >
                    {/* Product Image */}
                    <div className="relative rounded-custom-md overflow-hidden bg-brand-bg-warm aspect-[16/10] border border-brand-border/40 shadow-soft-sm">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 20vw"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-brand-dark-bg text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-soft-sm">
                        Bestseller
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id);
                        }}
                        aria-label="Save to Wishlist"
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur shadow transition-all cursor-pointer ${
                          isWishlisted ? "bg-white text-rose-600" : "bg-white/80 text-brand-dark-bg hover:bg-white"
                        }`}
                      >
                        <Heart size={12} className={isWishlisted ? "fill-current" : ""} />
                      </button>
                    </div>

                    {/* Card Details */}
                    <div className="flex-1 flex flex-col pt-4">
                      <Link
                        href={`/products/${encodeURIComponent(item.id)}`}
                        onClick={(event) => event.stopPropagation()}
                        className="font-display font-semibold text-sm text-brand-dark-bg group-hover:text-brand-accent transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-brand-secondary leading-relaxed font-light mt-2 flex-1 line-clamp-2">
                        {item.desc}
                      </p>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between">
                        <Link
                          href={`/products/${encodeURIComponent(item.id)}`}
                          onClick={(event) => event.stopPropagation()}
                          className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          Details
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestQuote(item.title);
                          }}
                          className="text-[9px] font-bold uppercase tracking-wider text-brand-dark-bg hover:text-brand-accent cursor-pointer"
                        >
                          Quote &rarr;
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
