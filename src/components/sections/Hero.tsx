"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Shield, Truck, ArrowRight, Award, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

interface HeroProps {
  onRequestQuote: () => void;
}

const heroSlides = [
  {
    id: 1,
    title: "Modern Student Desks",
    subtitle: "Ergonomic individual student desks & educational furniture",
    image: "/pics/sdm.png",
    badge: "Educational Furniture",
  },
  {
    id: 2,
    title: "Ergonomic Office Chairs",
    subtitle: "High-back mesh chairs with lumbar & headrest support",
    image: "/pics/kursi.jpeg",
    badge: "Office Seating",
  },
  {
    id: 3,
    title: "Executive Boss Seating",
    subtitle: "Premium leather executive chairs for leadership spaces",
    image: "/pics/executive_boss_leather_black.jpeg",
    badge: "Executive Furniture",
  },
  {
    id: 4,
    title: "Safes & Steel Storage",
    subtitle: "Heavy-duty digital safes & steel locker units",
    image: "/pics/digital_safe_rhino_yellow.jpeg",
    badge: "Storage & Security",
  },
  {
    id: 5,
    title: "Waiting Area Seating",
    subtitle: "Durable public area seating for hospitals, banks & offices",
    image: "/waiting_area.png",
    badge: "Public Waiting Area",
  },
];

export const Hero: React.FC<HeroProps> = ({ onRequestQuote }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

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

  const slide = heroSlides[currentSlide];

  return (
    <section id="hero" className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-36 xl:pt-40 xl:pb-24 overflow-hidden bg-background">
      {/* Background warm aesthetic circles */}
      <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-[#F7F3ED] rounded-full blur-[120px] opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-10 xl:gap-12 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-6 flex flex-col items-start text-left"
          >
            {/* Top Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-border bg-brand-bg-warm px-3 py-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-brand-dark-bg mb-4 md:mb-5"
            >
              <Shield size={12} className="shrink-0 text-brand-accent" />
              <span className="sm:hidden">Institutional furniture across Karnataka</span>
              <span className="hidden sm:inline">Trusted institutional furniture partner across Karnataka</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="max-w-2xl font-display text-[34px] sm:text-[38px] md:text-[40px] lg:text-5xl xl:text-[54px] font-bold leading-[1.06] tracking-tight text-brand-dark-bg"
            >
              Complete seating solutions for modern institutions
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-xl font-sans text-sm sm:text-base lg:text-lg font-light leading-relaxed text-brand-secondary"
            >
              Factory-direct seating, student desks, steel storage and security safes built for schools, offices, hospitals and institutions across Karnataka.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-3 items-center"
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

          </motion.div>

          {/* Right Column: Hero Image Transition Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={heroImageTransition}
            className="md:col-span-6 relative w-full md:pl-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image Slider Wrap */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-custom-xl border border-brand-border bg-brand-bg-warm shadow-soft-lg group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    loading="eager"
                    className="object-cover"
                    sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) 50vw, 46vw"
                  />
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark-bg opacity-100 shadow-md backdrop-blur transition-all hover:bg-white md:h-9 md:w-9 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark-bg opacity-100 shadow-md backdrop-blur transition-all hover:bg-white md:h-9 md:w-9 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>

              {/* Slide Counter & Indicators */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? "w-6 bg-brand-accent" : "w-2 bg-white/50 hover:bg-white"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Floating Badge: Space & Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-4 left-4 z-20 flex max-w-[230px] flex-col gap-1.5 rounded-custom-md border border-brand-border bg-white/95 p-3 shadow-soft-md backdrop-blur sm:bottom-5 sm:left-5 sm:max-w-[240px] sm:p-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent">
                  {slide.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-brand-dark-bg leading-tight">{slide.title}</h4>
              <p className="text-[11px] text-brand-secondary font-light leading-snug line-clamp-2">
                {slide.subtitle}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Keep the product visual above these trust signals on small screens. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-brand-border pt-6 text-brand-secondary md:mt-10 md:grid-cols-4 md:pt-8"
        >
          <div className="flex flex-col gap-2">
            <Award size={18} className="text-brand-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">30+ Yrs Experience</span>
          </div>
          <div className="flex flex-col gap-2">
            <Package size={18} className="text-brand-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">Bulk Supply</span>
          </div>
          <div className="flex flex-col gap-2">
            <Shield size={18} className="text-brand-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">2-Year Warranty</span>
          </div>
          <div className="flex flex-col gap-2">
            <Truck size={18} className="text-brand-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-bg">Delivery & Installation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
