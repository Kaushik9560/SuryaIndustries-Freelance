"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium font-sans rounded-pill transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-dark-bg text-white hover:bg-neutral-800 border border-transparent shadow-soft-sm",
    secondary:
      "bg-white text-foreground border border-brand-border hover:border-neutral-400 hover:bg-neutral-50 shadow-soft-sm",
    accent:
      "bg-brand-accent text-white hover:bg-[#b5883d] border border-transparent shadow-soft-sm",
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-4 text-base",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
