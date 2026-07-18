"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

interface HeaderProps {
  onRequestQuote: () => void;
  onSelectSale: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestQuote, onSelectSale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Industries", href: "#industries" },
    { name: "Gallery", href: "#gallery" },
    { name: "Clearance Sale", href: "#products", isSale: true },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = (href: string, isSale?: boolean) => {
    setIsOpen(false);
    if (isSale) {
      onSelectSale();
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-brand-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-serif font-bold text-lg shadow-soft-sm transition-transform duration-300 group-hover:scale-105">
            S
          </div>
          <span className="font-display font-semibold text-lg tracking-wide text-brand-dark-bg">
            Surya Industry
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href, link.isSale)}
              className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-200 cursor-pointer ${
                link.isSale
                  ? "text-brand-accent hover:text-[#b5883d] flex items-center gap-1.5"
                  : "text-brand-secondary hover:text-brand-dark-bg"
              }`}
            >
              {link.name}
              {link.isSale && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button variant="primary" size="sm" onClick={onRequestQuote}>
            Request a Quote
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-brand-dark-bg hover:text-brand-accent transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-b border-brand-border overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href, link.isSale)}
                  className={`text-left text-sm font-semibold uppercase tracking-widest py-1 border-b border-transparent hover:border-brand-accent w-full cursor-pointer ${
                    link.isSale ? "text-brand-accent flex items-center gap-2" : "text-brand-secondary hover:text-brand-dark-bg"
                  }`}
                >
                  {link.name}
                  {link.isSale && (
                    <span className="px-2 py-0.5 text-[9px] bg-brand-accent/15 text-brand-accent rounded font-sans tracking-normal lowercase">
                      sale
                    </span>
                  )}
                </button>
              ))}
              <Button
                variant="primary"
                size="md"
                className="w-full mt-4 flex items-center justify-center gap-2"
                onClick={() => {
                  setIsOpen(false);
                  onRequestQuote();
                }}
              >
                Request a Quote
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
