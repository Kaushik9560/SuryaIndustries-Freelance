"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Check, Download, Send } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { useModalAccessibility } from "@/hooks/useModalAccessibility";
import { SITE_CONFIG } from "@/config/site";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory = "",
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    categories: preselectedCategory ? [preselectedCategory] : [] as string[],
    industry: "",
    quantity: "",
    timeline: "",
    name: "",
    organization: "",
    email: "",
    phone: "",
    location: "",
    details: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  useModalAccessibility({ isOpen, onClose, containerRef: dialogRef });

  const modalTransition = {
    duration: 0.3,
    ease: "easeOut",
  } as const;

  const categoriesOptions = [
    "Office Chairs",
    "Waiting Chairs",
    "Student Desk & Bench",
    "Lockers",
    "Storage Cabinets",
    "Office Tables",
  ];

  const selectableCategoryOptions =
    preselectedCategory && !categoriesOptions.includes(preselectedCategory)
      ? [preselectedCategory, ...categoriesOptions]
      : categoriesOptions;

  const industryOptions = [
    { value: "", label: "Select Institution Type" },
    { value: "Education", label: "Educational Institution (School/College/Uni)" },
    { value: "Corporate", label: "Corporate Office" },
    { value: "Healthcare", label: "Hospital / Healthcare Space" },
    { value: "Financial", label: "Bank / Financial Branch" },
    { value: "Government", label: "Government Organization" },
    { value: "Commercial", label: "Commercial Space" },
  ];

  const quantityOptions = [
    { value: "", label: "Select Estimated Quantity" },
    { value: "1-10", label: "Under 10 Units" },
    { value: "10-50", label: "10 to 50 Units" },
    { value: "50-100", label: "50 to 100 Units" },
    { value: "100-500", label: "100 to 500 Units" },
    { value: "500+", label: "More than 500 Units" },
  ];

  const timelineOptions = [
    { value: "", label: "Select Installation Timeline" },
    { value: "Immediate", label: "Immediate (Within 30 days)" },
    { value: "1-3 Months", label: "1 to 3 Months" },
    { value: "3-6 Months", label: "3 to 6 Months" },
    { value: "Planning", label: "Planning / Budgeting Phase" },
  ];

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.categories.includes(category);
      if (alreadySelected) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category],
        };
      }
    });
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: "" }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.categories.length === 0) {
      newErrors.categories = "Please select at least one product category.";
    }
    if (!formData.industry) {
      newErrors.industry = "Institution type is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.quantity) {
      newErrors.quantity = "Please select an estimated quantity.";
    }
    if (!formData.timeline) {
      newErrors.timeline = "Please select a required installation timeline.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Contact name is required.";
    if (!formData.organization.trim()) newErrors.organization = "Organization/Institution name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (!formData.location.trim()) newErrors.location = "Delivery location/district in Karnataka is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!validateStep3() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    idempotencyKeyRef.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
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
        setSubmitError(result.error || "The request could not be submitted. Please retry.");
        return;
      }

      setReferenceCode(result.referenceCode);
      setStep(4);
    } catch {
      setSubmitError("We could not reach the server. Check your connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadSummaryFile = () => {
    const content = `SURYA INDUSTRIES - INSTITUTIONAL PROCUREMENT QUOTE REQUEST
============================================================
Reference ID: ${referenceCode}
Date: ${new Date().toLocaleDateString()}
Status: Request Received & In Review

INQUIRY DETAILS:
------------------------------------------------------------
Product Categories Needed: ${formData.categories.join(", ")}
Institution Type:          ${formData.industry}
Estimated Quantity Tiers:  ${formData.quantity}
Delivery Timeline:         ${formData.timeline}

CONTACT DETAILS:
------------------------------------------------------------
Contact Person:            ${formData.name}
Organization Name:         ${formData.organization}
Email Address:             ${formData.email}
Phone Number:              ${formData.phone}
Installation Location:     ${formData.location}

SPECIFIC REQUIRMENTS / INSTRUCTIONS:
------------------------------------------------------------
${formData.details || "No additional requirements specified."}

============================================================
Thank you for reaching out to Surya Industries. A procurement
specialist will review your space layouts and requirements,
compile a formal commercial proposal, and contact you within
1 business day.

Contact: ${SITE_CONFIG.contactEmail || SITE_CONFIG.contactPhone || "Submitted through the Surya Industries website"}
Factory: ${SITE_CONFIG.factoryAddress}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Surya_Industry_Quote_Request_${formData.organization.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={modalTransition}
            className="relative w-full max-w-2xl bg-white border border-brand-border rounded-custom-xl shadow-soft-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 md:px-8 py-5 border-b border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
                  Procurement Form
                </span>
                <h3 id="quote-modal-title" className="font-display font-semibold text-lg text-brand-dark-bg mt-0.5">
                  Request institutional quotation
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quotation form"
                className="p-1.5 rounded-full hover:bg-neutral-100 text-brand-secondary hover:text-brand-dark-bg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step Indicators */}
            {step < 4 && (
              <div className="px-6 md:px-8 py-4 bg-brand-bg-warm/50 border-b border-brand-border flex items-center justify-between text-xs font-semibold tracking-wider text-brand-secondary">
                <span className={step === 1 ? "text-brand-accent" : ""}>01 Category & Industry</span>
                <div className="h-[1px] flex-1 bg-brand-border mx-4" />
                <span className={step === 2 ? "text-brand-accent" : ""}>02 Volume & Timeline</span>
                <div className="h-[1px] flex-1 bg-brand-border mx-4" />
                <span className={step === 3 ? "text-brand-accent" : ""}>03 Contact Details</span>
              </div>
            )}

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-[10px] font-semibold text-brand-secondary uppercase tracking-widest block mb-3">
                      Select Required Furniture Categories (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {selectableCategoryOptions.map((cat) => {
                        const isSelected = formData.categories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryToggle(cat)}
                            aria-pressed={isSelected}
                            className={`flex items-center gap-3 p-4 rounded-custom-md border text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-brand-bg-warm/60 border-brand-accent text-brand-dark-bg shadow-soft-sm"
                                : "bg-white border-brand-border hover:border-neutral-400 text-brand-secondary hover:text-brand-dark-bg"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isSelected
                                  ? "bg-brand-accent border-brand-accent text-white"
                                  : "border-brand-border bg-white"
                              }`}
                            >
                              {isSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span>{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.categories && (
                      <p className="text-xs text-red-500 font-medium mt-2">{errors.categories}</p>
                    )}
                  </div>

                  <Select
                    name="industry"
                    label="What Type of Institution is this for?"
                    value={formData.industry}
                    onChange={handleInputChange}
                    options={industryOptions}
                    error={errors.industry}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <Select
                    name="quantity"
                    label="Estimated Total Units Needed"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    options={quantityOptions}
                    error={errors.quantity}
                  />

                  <Select
                    name="timeline"
                    label="Required Delivery & Installation Timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    options={timelineOptions}
                    error={errors.timeline}
                  />
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="absolute -left-[10000px]" aria-hidden="true">
                    <label htmlFor="quote-website">Website</label>
                    <input
                      ref={websiteRef}
                      id="quote-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      label="Contact Person Name"
                      placeholder="e.g. Anand Kumar"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                    <Input
                      name="organization"
                      label="Institution / Company Name"
                      placeholder="e.g. Bangalore Academy of Science"
                      value={formData.organization}
                      onChange={handleInputChange}
                      error={errors.organization}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="email"
                      type="email"
                      label="Official Email Address"
                      placeholder="e.g. procurement@inst.edu"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                    <Input
                      name="phone"
                      type="tel"
                      label="Contact Phone Number"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                    />
                  </div>

                  <Input
                    name="location"
                    label="Installation Site Location (District/City in Karnataka)"
                    placeholder="e.g. Peenya, Bengaluru"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={errors.location}
                  />

                  <Textarea
                    name="details"
                    label="Additional Details or Custom Requirements (Optional)"
                    placeholder="Describe layout sizes, specific styling, custom locks, clearance specifications or budget goals..."
                    value={formData.details}
                    onChange={handleInputChange}
                  />

                  {submitError && (
                    <p role="alert" className="text-xs font-medium text-red-600">
                      {submitError}
                    </p>
                  )}
                </form>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center justify-center text-center py-10 px-4">
                  <div className="w-16 h-16 rounded-full bg-brand-bg-warm flex items-center justify-center text-brand-accent mb-6">
                    <Check size={28} />
                  </div>
                  <span className="text-[10px] font-semibold text-brand-accent uppercase tracking-widest">
                    Submission Received
                  </span>
                  <span className="mt-2 rounded-full bg-brand-bg-warm px-3 py-1 text-[10px] font-semibold tracking-wider text-brand-accent">
                    {referenceCode}
                  </span>
                  <h4 className="font-display font-bold text-2xl text-brand-dark-bg mt-1 mb-3">
                    Thank you, {formData.name}
                  </h4>
                  <p className="text-sm text-brand-secondary max-w-md leading-relaxed mb-8">
                    Your procurement quote request for <span className="font-semibold text-brand-dark-bg">{formData.organization}</span> has been logged successfully. A commercial seating and storage advisor will contact you within 1 business day.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <Button
                      variant="primary"
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={downloadSummaryFile}
                    >
                      <Download size={16} />
                      Download Request summary
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={onClose}>
                      Close Window
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {step < 4 && (
              <div className="px-6 md:px-8 py-5 border-t border-brand-border flex items-center justify-between bg-neutral-50/50">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={step === 1 ? "opacity-0 cursor-default" : "flex items-center gap-2"}
                >
                  <ArrowLeft size={14} />
                  Back
                </Button>

                {step < 3 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send size={14} />
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
