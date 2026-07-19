"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Heart, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { useProducts } from "@/context/ProductContext";

interface HeaderProps {
  onRequestQuote: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestQuote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wishlist } = useProducts();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/#hero" },
    { name: "About", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Clearance Sale", href: "/clearance" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-brand-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-serif font-bold text-lg shadow-soft-sm transition-transform duration-300 group-hover:scale-105">
            S
          </div>
          <span className="font-display font-semibold text-lg tracking-wide text-brand-dark-bg">
            Surya Industries
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200 cursor-pointer text-brand-secondary hover:text-brand-dark-bg"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Wishlist */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/#products"
            className="relative p-2.5 rounded-full border border-brand-border bg-white/80 backdrop-blur text-brand-secondary hover:text-brand-dark-bg transition-colors"
            title="Saved Wishlist Items"
          >
            <Heart size={16} className={wishlist.length > 0 ? "text-rose-600 fill-current" : ""} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            className="text-xs font-semibold uppercase tracking-widest text-brand-secondary hover:text-brand-dark-bg transition-colors flex items-center gap-1.5 border border-brand-border/60 rounded-full px-3 py-1.5 bg-white/60"
            title="Owner Admin Portal"
          >
            <Lock size={12} className="text-brand-accent" />
            <span>Admin</span>
          </Link>

          <Button variant="primary" size="sm" onClick={onRequestQuote}>
            Request a Quote
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-brand-dark-bg hover:text-brand-accent transition-colors cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-b border-brand-border overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-left text-sm font-semibold uppercase tracking-widest py-1 border-b border-transparent hover:border-brand-accent w-full cursor-pointer text-brand-secondary hover:text-brand-dark-bg"
                >
                  {link.name}
                </Link>
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
