"use client";

import React from "react";
import { GraduationCap, Building2, Hospital, Landmark, Award } from "lucide-react";
import { Card } from "../ui/Card";
import { motion, type Variants } from "framer-motion";

export const DecisionMakers: React.FC = () => {
  const categories = [
    {
      title: "Educational Institutions",
      desc: "classroom seating, lab seating, lockers.",
      icon: GraduationCap,
    },
    {
      title: "Corporate Offices",
      desc: "Workstations, meeting rooms, waiting areas, and executive seating needs.",
      icon: Building2,
    },
    {
      title: "Hospitals & Clinics",
      desc: "Waiting seating, staff areas.",
      icon: Hospital,
    },
    {
      title: "Banks & Finance",
      desc: "Customer seating, storage.",
      icon: Landmark,
    },
    {
      title: "Government Organizations",
      desc: "Reliable supply, installation, and support for public offices and facilities.",
      icon: Award,
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  } satisfies Variants;

  return (
    <section id="audiences" className="py-20 md:py-28 bg-[#F7F3ED]/40 border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
            Institutional Focus
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark-bg mt-2 tracking-tight">
            Built for institutional decision makers
          </h2>
          <p className="text-sm md:text-base text-brand-secondary leading-relaxed font-light mt-4">
            Clear, practical furniture solutions for procurement teams, facility managers, and administrators who need dependable execution.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-6"
        >
          {categories.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] flex"
            >
              <Card className="h-full w-full flex flex-col items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-bg-warm flex items-center justify-center text-brand-accent border border-brand-border">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-brand-dark-bg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-secondary leading-relaxed mt-2 font-light">
                    {item.desc}
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
