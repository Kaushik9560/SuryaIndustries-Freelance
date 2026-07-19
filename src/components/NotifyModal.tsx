"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BellRing, CheckCircle2, Mail, Phone } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { Button } from "./ui/Button";
import { useModalAccessibility } from "@/hooks/useModalAccessibility";

export const NotifyModal: React.FC = () => {
  const { isNotifyOpen, notifyTargetProduct, closeNotifyModal } = useProducts();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const idempotencyKeyRef = useRef<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError("");
    setReferenceCode("");
    setEmail("");
    setPhone("");
    idempotencyKeyRef.current = null;
    closeNotifyModal();
  };

  useModalAccessibility({
    isOpen: isNotifyOpen && Boolean(notifyTargetProduct),
    onClose: handleClose,
    containerRef: dialogRef,
  });

  if (!notifyTargetProduct) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    idempotencyKeyRef.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: notifyTargetProduct.id,
          productTitle: notifyTargetProduct.title,
          email,
          phone,
          sourcePath: window.location.pathname,
          idempotencyKey: idempotencyKeyRef.current,
          website: websiteRef.current?.value ?? "",
        }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        referenceCode?: string;
        error?: string;
      };

      if (!response.ok || !result.ok || !result.referenceCode) {
        setSubmitError(result.error || "Your interest could not be registered. Please retry.");
        return;
      }

      setReferenceCode(result.referenceCode);
      setSubmitted(true);
      closeTimerRef.current = setTimeout(handleClose, 3500);
    } catch {
      setSubmitError("We could not reach the server. Check your connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isNotifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Box */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notify-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-background border border-brand-border rounded-custom-xl shadow-soft-lg p-6 sm:p-8 z-10"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close stock notification form"
              className="absolute top-4 right-4 p-2 rounded-full bg-white border border-brand-border text-brand-dark-bg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {!submitted ? (
              <div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mb-4">
                  <BellRing size={22} />
                </div>

                <h3 id="notify-modal-title" className="font-display font-bold text-xl text-brand-dark-bg tracking-tight">
                  Notify Me When Available
                </h3>
                <p className="text-xs text-brand-secondary leading-relaxed font-light mt-1">
                  Leave your contact details for <strong className="text-brand-dark-bg">{notifyTargetProduct.title}</strong>. We will notify your team as soon as stock is ready.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div className="absolute -left-[10000px]" aria-hidden="true">
                    <label htmlFor="notify-website">Website</label>
                    <input
                      ref={websiteRef}
                      id="notify-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="notify-email" className="block text-xs font-semibold uppercase tracking-wider text-brand-dark-bg mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="notify-email"
                        type="email"
                        required
                        placeholder="procurement@institution.org"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setSubmitError("");
                        }}
                        className="w-full bg-brand-bg-warm/60 border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-foreground outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notify-phone" className="block text-xs font-semibold uppercase tracking-wider text-brand-dark-bg mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="notify-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setSubmitError("");
                        }}
                        className="w-full bg-brand-bg-warm/60 border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-foreground outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p role="alert" className="text-xs font-medium text-red-600">
                      {submitError}
                    </p>
                  )}

                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Notification Interest"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-brand-dark-bg">Interest Registered</h3>
                <p className="text-xs text-brand-secondary mt-2 leading-relaxed max-w-xs">
                  Thank you! Our procurement desk will contact you as soon as batch production completes.
                </p>
                <span className="mt-3 rounded-full bg-brand-bg-warm px-3 py-1 text-[10px] font-semibold tracking-wider text-brand-accent">
                  {referenceCode}
                </span>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
