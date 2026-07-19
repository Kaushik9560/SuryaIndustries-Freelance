"use client";

import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/config/site";

interface QuoteCTAProps {
  onRequestQuote: () => void;
}

export const QuoteCTA: React.FC<QuoteCTAProps> = ({ onRequestQuote }) => {
  const whatsappUrl = SITE_CONFIG.whatsappNumber
    ? `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=Hello%20Surya%20Industries,%20I%20would%20like%20to%20discuss%20our%20institutional%20furniture%20requirements.`
    : null;

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#111111] text-white rounded-custom-xl p-8 md:p-16 border border-neutral-800 shadow-soft-lg text-center flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Subtle grid background style overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-brand-dark-bg to-brand-dark-bg opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-6">
            <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
              Direct procurement consultation
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Discuss your institutional furniture requirements
            </h2>
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-light">
              Share your space layout, estimated quantities, budget goals, and installation timeline. Surya Industries will help recommend and quote suitable seating and storage solutions for your organization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center mt-6 w-full sm:w-auto">
              <Button
                variant="accent"
                size="md"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
                onClick={onRequestQuote}
              >
                Request a Quote
                <ArrowRight size={16} />
              </Button>
              
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-medium font-sans rounded-pill transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 bg-transparent text-white border border-neutral-700 hover:border-neutral-400 hover:bg-neutral-900/60 px-7 py-3 text-sm shadow-soft-sm gap-2"
                >
                  <MessageSquare size={16} className="text-green-500 fill-green-500/10" />
                  <span>WhatsApp Us</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
