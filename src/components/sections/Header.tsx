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
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-brand-border py-3 lg:py-4" : "bg-transparent py-4 lg:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/#hero" onClick={() => setIsOpen(false)} className="flex min-w-0 items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-accent flex items-center justify-center text-white font-serif font-bold text-lg shadow-soft-sm transition-transform duration-300 group-hover:scale-105">
            S
          </div>
          <span className="whitespace-nowrap font-display font-semibold text-base sm:text-lg tracking-wide text-brand-dark-bg">
            Surya Industries
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-8">
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
        <div className="hidden xl:flex items-center gap-4">
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

        {/* Compact actions stay available on phones, tablets, and narrow laptops. */}
        <div className="xl:hidden flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/#products"
            onClick={() => setIsOpen(false)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white/80 text-brand-secondary transition-colors hover:text-brand-dark-bg"
            aria-label={`Wishlist${wishlist.length > 0 ? `, ${wishlist.length} saved items` : ""}`}
            title="Wishlist"
          >
            <Heart size={16} className={wishlist.length > 0 ? "fill-current text-rose-600" : ""} />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white shadow">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white/80 text-brand-secondary transition-colors hover:text-brand-dark-bg"
            aria-label="Owner admin portal"
            title="Admin"
          >
            <Lock size={15} className="text-brand-accent" />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-dark-bg transition-colors hover:bg-brand-bg-warm hover:text-brand-accent cursor-pointer"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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
            className="xl:hidden bg-background border-b border-brand-border shadow-soft-md overflow-hidden"
          >
            <div className="max-w-7xl max-h-[calc(100dvh-68px)] mx-auto overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
              <nav className="grid gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-widest text-brand-secondary transition-colors hover:bg-brand-bg-warm hover:text-brand-dark-bg"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-brand-border pt-4">
                <Link
                  href="/#products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-xs font-semibold text-brand-dark-bg"
                >
                  <Heart size={15} className={wishlist.length > 0 ? "fill-current text-rose-600" : "text-brand-accent"} />
                  Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ""}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-xs font-semibold text-brand-dark-bg"
                >
                  <Lock size={14} className="text-brand-accent" />
                  Admin Panel
                </Link>
              </div>

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
