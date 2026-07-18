"use client";

import React from "react";
import { Sliders, CheckCircle2, Truck, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
import { Card } from "../ui/Card";
import { motion } from "framer-motion";

export const PartnerSection: React.FC = () => {
  const partners = [
    {
      title: "Customized Furniture Solutions",
      desc: "Support in matching furniture choices to room sizes, usage, budgets, and procurement needs.",
      icon: Sliders,
    },
    {
      title: "Quality-Assured Products",
      desc: "Carefully selected products suitable for high-use institutional environments.",
      icon: CheckCircle2,
    },
    {
      title: "Delivery & Installation",
      desc: "Coordinated delivery and installation support so spaces are ready for use.",
      icon: Truck,
    },
    {
      title: "Two-Year Service Warranty",
      desc: "Service commitment from the date of installation for long-term confidence.",
      icon: ShieldCheck,
    },
    {
      title: "Dedicated Customer Support",
      desc: "Responsive assistance for quotations, product guidance, installation, and service needs.",
      icon: HeartHandshake,
    },
    {
      title: "Service Across Karnataka",
      desc: "Serving institutional buyers across the state with dependable coordination.",
      icon: MapPin,
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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-20 md:py-28 bg-[#F7F3ED]/30 border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
            Service Commitment
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark-bg mt-2 tracking-tight">
            A dependable partner from selection to support
          </h2>
          <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-light mt-4">
            Surya Industry focuses on getting furniture requirements understood, supplied, installed, and supported with professional follow-through.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {partners.map((partner, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="h-full flex flex-col gap-5 border border-brand-border/60 p-6 md:p-8 bg-white transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-brand-bg-warm flex items-center justify-center text-brand-accent border border-brand-border/40 shrink-0">
                  <partner.icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-brand-dark-bg leading-tight">
                    {partner.title}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-secondary leading-relaxed font-light mt-3">
                    {partner.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
