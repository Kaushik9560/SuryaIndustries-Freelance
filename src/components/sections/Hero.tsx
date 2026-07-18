"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Shield, Truck, Settings, ArrowRight, Clock } from "lucide-react";
import { Button } from "../ui/Button";

interface HeroProps {
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestQuote }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  } satisfies Variants;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } satisfies Variants;

  const heroImageTransition = {
    duration: 0.8,
    delay: 0.2,
    ease: "easeOut",
  } as const;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
      {/* Background warm aesthetic circles */}
      <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-[#F7F3ED] rounded-full blur-[120px] opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Top Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bg-warm border border-brand-border text-brand-dark-bg text-[10px] font-semibold uppercase tracking-wider mb-6"
            >
              <Shield size={12} className="text-brand-accent" />
              <span>Trusted institutional furniture partner across Karnataka</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold text-4xl md:text-5xl lg:text-[56px] text-brand-dark-bg leading-[1.1] tracking-tight max-w-xl"
            >
              Complete Seating & Storage Solutions for Modern Institutions
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base md:text-lg text-brand-secondary leading-relaxed max-w-lg font-sans font-light"
            >
              Providing customized furniture solutions for schools, colleges, hospitals, offices, banks, and other institutions across Karnataka.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4 items-center"
            >
              <Button variant="primary" size="md" onClick={onRequestQuote}>
                Request a Quote
              </Button>
              <a
                href="#products"
                className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-brand-dark-bg hover:text-brand-accent transition-colors duration-200"
              >
                Explore Products
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Quality Checklist */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-brand-border grid grid-cols-3 gap-6 text-brand-secondary"
            >
              <div className="flex flex-col gap-2">
                <Settings size={18} className="text-brand-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">Customized supply</span>
              </div>
              <div className="flex flex-col gap-2">
                <Truck size={18} className="text-brand-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">Delivery & installation</span>
              </div>
              <div className="flex flex-col gap-2">
                <Shield size={18} className="text-brand-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">2-year service warranty</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Image Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={heroImageTransition}
            className="lg:col-span-5 relative"
          >
            {/* Image Wrap */}
            <div className="relative rounded-custom-xl overflow-hidden border border-brand-border bg-brand-bg-warm aspect-[4/3] sm:aspect-square shadow-soft-lg">
              <Image
                src="/classroom_hero.png"
                alt="Institutional Classroom furniture installation with warm sunlight"
                fill
                priority
                loading="eager"
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 40vw"
              />
            </div>

            {/* Floating Badge 1: Karnataka Coverage */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute left-6 bottom-6 bg-white/95 backdrop-blur border border-brand-border rounded-custom-md p-4 shadow-soft-md max-w-[210px] flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark-bg">Karnataka</span>
              </div>
              <p className="text-xs text-brand-secondary font-medium">Supply, install & support statewide.</p>
            </motion.div>

            {/* Floating Badge 2: Prompt Assistance */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute right-6 top-6 bg-white/95 backdrop-blur border border-brand-border rounded-custom-md px-4 py-2.5 shadow-soft-md flex items-center gap-2"
            >
              <Clock size={14} className="text-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark-bg">Prompt assistance</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
