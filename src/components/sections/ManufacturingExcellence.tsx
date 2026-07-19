"use client";

import React from "react";
import { motion } from "framer-motion";
import { Factory, ShieldCheck, Truck, Award, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";

const pillars = [
  {
    icon: Factory,
    title: "Direct Factory Manufacturing",
    desc: "Precision engineering using heavy-gauge cold-rolled steel, robotic welding, and anti-corrosive powder coating built for decades of use.",
    highlight: "Peenya Industrial Hub",
  },
  {
    icon: Award,
    title: "Ergonomic & Durability Tested",
    desc: "All seating and desk systems comply with strict ergonomic standards to ensure comfort during long working or study hours.",
    highlight: "ANSI/BIFMA Compliant",
  },
  {
    icon: Truck,
    title: "Turnkey Bulk Logistics & Setup",
    desc: "From initial layout planning to statewide delivery and on-site professional assembly across all districts in Karnataka.",
    highlight: "Statewide Coverage",
  },
  {
    icon: ShieldCheck,
    title: "2-Year Direct Warranty",
    desc: "Every product includes a comprehensive 2-year manufacturer warranty with dedicated local technical support.",
    highlight: "Prompt Support",
  },
];

export const ManufacturingExcellence: React.FC<{ onRequestQuote: () => void }> = ({ onRequestQuote }) => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#F7F3ED]/30 border-y border-brand-border font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
              Institutional Trust & Excellence
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark-bg mt-2 tracking-tight">
              Built in Karnataka. Engineered for high-use public spaces.
            </h2>
            <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-light mt-4">
              With over 30 years of manufacturing experience, Surya Industries provides institutions with durable, ergonomically sound seating and secure storage solutions built for long lifecycle value.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onRequestQuote}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-dark-bg hover:text-brand-accent transition-colors"
            >
              Contact Procurement Team
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 flex flex-col justify-between border border-brand-border/60 bg-white hover:border-brand-accent/40 transition-all duration-300">
                  <div>
                    <div className="w-10 h-10 rounded-custom-md bg-brand-bg-warm border border-brand-border flex items-center justify-center text-brand-accent mb-5">
                      <Icon size={20} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded bg-brand-accent/5 inline-block mb-3">
                      {pillar.highlight}
                    </span>
                    <h3 className="font-display font-semibold text-base text-brand-dark-bg leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-brand-secondary leading-relaxed font-light mt-3">
                      {pillar.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
