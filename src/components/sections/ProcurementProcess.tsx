"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Users, ClipboardList, Armchair, FileText, Settings, Truck, Wrench, Headphones } from "lucide-react";

export const ProcurementProcess: React.FC = () => {
  const steps = [
    {
      title: "Consultation",
      desc: "We understand your needs and space.",
      icon: Users,
    },
    {
      title: "Requirement Analysis",
      desc: "We analyze and suggest the best solutions.",
      icon: ClipboardList,
    },
    {
      title: "Product Selection",
      desc: "Choose from a wide range of quality products.",
      icon: Armchair,
    },
    {
      title: "Quotation",
      desc: "Transparent pricing with best value.",
      icon: FileText,
    },
    {
      title: "Manufacturing / Procurement",
      desc: "Quality-driven process with timely updates.",
      icon: Settings,
    },
    {
      title: "Delivery",
      desc: "Safe and on-time delivery.",
      icon: Truck,
    },
    {
      title: "Installation",
      desc: "Professional installation by experienced team.",
      icon: Wrench,
    },
    {
      title: "After-Sales Support",
      desc: "We're here even after the installation.",
      icon: Headphones,
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 relative"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col gap-4 relative group"
            >
              {/* Connector line for large screens (horizontal) */}
              {idx % 4 !== 3 && idx < 7 && (
                <div className="hidden lg:block absolute top-5 left-[calc(100%-40px)] w-[calc(100%-80px)] h-[1px] bg-neutral-800 z-0 transition-colors group-hover:bg-brand-accent/50" />
              )}
              
              {/* Stepper Node */}
              <div className="flex items-center gap-4 z-10">
                <div className="w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center text-brand-accent group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
                  <step.icon size={18} strokeWidth={1.5} className="transition-colors group-hover:text-white" />
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
