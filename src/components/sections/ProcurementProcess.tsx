"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

export const ProcurementProcess: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Requirement Discussion",
      desc: "We analyze room dimensions, usage patterns, student/staff counts, and budget parameters.",
    },
    {
      num: "02",
      title: "Product Recommendation",
      desc: "We recommend optimized seating heights, modular configurations, and storage locking types.",
    },
    {
      num: "03",
      title: "Formal Quotation",
      desc: "We provide structured commercial proposals with customized supply schedules and warranty breakdowns.",
    },
    {
      num: "04",
      title: "Order Confirmation",
      desc: "Procurement orders are logged and technical drawings are aligned before manufacturing batching.",
    },
    {
      num: "05",
      title: "Delivery & Installation",
      desc: "Our logistical teams coordinate delivery and complete assembly at the institution site.",
    },
    {
      num: "06",
      title: "After-Sales Support",
      desc: "Two-year warranty triggers instantly, with dedicated contact points for maintenance issues.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } satisfies Variants;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  } satisfies Variants;

  return (
    <section id="process" className="py-20 md:py-28 bg-[#111111] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
            Logistical Excellence
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-2 tracking-tight">
            A clear process for institutional procurement
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-light mt-4">
            From the first requirement discussion to after-sales support, each step is designed to reduce confusion and improve execution.
          </p>
        </div>

        {/* Stepper Timeline Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 relative"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col gap-4 relative group"
            >
              {/* Connector line for large screens (horizontal) */}
              {idx % 3 !== 2 && idx < 5 && (
                <div className="hidden lg:block absolute top-5 left-[calc(100%-40px)] w-[calc(100%-80px)] h-[1px] bg-neutral-800 z-0 transition-colors group-hover:bg-brand-accent/50" />
              )}
              
              {/* Stepper Node */}
              <div className="flex items-center gap-4 z-10">
                <div className="w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center text-xs font-bold font-sans text-brand-accent group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
                  {step.num}
                </div>
                <h3 className="font-display font-semibold text-base text-white tracking-wide">
                  {step.title}
                </h3>
              </div>

              {/* Desc */}
              <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-light pl-14">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
