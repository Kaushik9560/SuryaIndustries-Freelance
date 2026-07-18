"use client";

import { Shield, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export const WarrantyCallout: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-brand-dark-bg text-white rounded-custom-xl p-8 md:p-16 border border-neutral-800 shadow-soft-lg flex flex-col lg:flex-row lg:items-center justify-between gap-12"
        >
          {/* Text block */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-[10px] font-semibold uppercase tracking-wider mb-5">
              <Shield size={12} />
              <span>2-Year Service Warranty</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Long-term assistance after installation
            </h2>
            <p className="text-sm md:text-base text-neutral-400 mt-4 leading-relaxed font-light">
              Surya Industry emphasizes prompt assistance and dependable support from the date of installation, helping institutions keep furniture usable and functional over time.
            </p>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-5 shrink-0 bg-neutral-900/40 p-6 md:p-8 rounded-custom-lg border border-neutral-800 w-full lg:max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mt-0.5 shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Prompt coordination</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Dedicated service desk coordinates physical inspection and quick repair for schools, hospitals, and offices.
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-neutral-800" />

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mt-0.5 shrink-0">
                <CheckCircle size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Warranty Activation</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Your formal digital service logging starts automatically on the date of physical installation completion.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
