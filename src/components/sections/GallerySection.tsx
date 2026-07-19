"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MapPin } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "Collaborative Classroom Layout",
    space: "educational",
    location: "Bengaluru, Karnataka",
    image: "/classroom_hero.png",
    dimensions: "Double desk systems with chalkboard setups",
  },
  {
    id: 2,
    title: "Executive Workstation Setup",
    space: "offices",
    location: "Hubballi, Karnataka",
    image: "/pics/ergonomic_mesh_headrest_side.jpeg",
    dimensions: "Ergonomic high-back mesh chair & executive desk",
  },
  {
    id: 3,
    title: "Boss Leather Executive Suite",
    space: "offices",
    location: "Mangaluru, Karnataka",
    image: "/pics/executive_boss_leather_black.jpeg",
    dimensions: "High-grade leather boss chair with multi-tilt",
  },
  {
    id: 4,
    title: "Outpatient Waiting Area",
    space: "hospitals",
    location: "Mysuru, Karnataka",
    image: "/waiting_area.png",
    dimensions: "Heavy-duty anti-bacterial seating rows",
  },
  {
    id: 5,
    title: "In-Wardrobe Digital Security Safe",
    space: "storage",
    location: "Belagavi, Karnataka",
    image: "/pics/digital_safe_wardrobe_setup.jpeg",
    dimensions: "Concealed heavy-gauge electronic locker",
  },
  {
    id: 6,
    title: "Rhino Advanced Security Safe",
    space: "storage",
    location: "Tumakuru, Karnataka",
    image: "/pics/digital_safe_rhino_yellow.jpeg",
    dimensions: "Dual lock mechanism vault with digital keypad",
  },
];

const filterOptions = [
  { id: "all", label: "All Spaces" },
  { id: "educational", label: "Educational" },
  { id: "offices", label: "Offices" },
  { id: "hospitals", label: "Hospitals" },
  { id: "banks", label: "Banks" },
  { id: "storage", label: "Storage Solutions" },
];

export const GallerySection: React.FC = () => {
  const [filter, setFilter] = useState("all");

  const filteredItems = useMemo(() => {
    if (filter === "all") return galleryItems;
    return galleryItems.filter((item) => item.space === filter);
  }, [filter]);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#F7F3ED]/20 border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
            Visual Proof
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark-bg mt-2 tracking-tight">
            Installation gallery by space type
          </h2>
          <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-light mt-4">
            A refined preview of the spaces Surya Industries supports — from educational rooms to storage-led facilities.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                filter === opt.id
                  ? "bg-brand-dark-bg text-white"
                  : "bg-transparent text-brand-secondary hover:text-brand-dark-bg"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="group relative bg-white border border-brand-border rounded-custom-lg overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-bg-warm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center text-brand-dark-bg">
                      <Eye size={18} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">
                      {item.space} Space
                    </span>
                    <h3 className="font-display font-semibold text-base text-brand-dark-bg mt-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-secondary mt-1 font-light leading-relaxed">
                      {item.dimensions}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-secondary border-t border-brand-border/40 pt-3">
                    <MapPin size={12} className="text-brand-accent shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
