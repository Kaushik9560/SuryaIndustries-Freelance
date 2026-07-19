"use client";

import Image from "next/image";
import { type DragEvent, type FormEvent, type ReactNode, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgePercent,
  Check,
  ChevronRight,
  CircleCheck,
  Eye,
  ImageIcon,
  Images,
  ListChecks,
  LoaderCircle,
  PackageCheck,
  Plus,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  getProductMediaLabel,
  PRODUCT_MEDIA_ASSETS,
  type ProductMediaCategory,
} from "@/data/product-media";
import { useModalAccessibility } from "@/hooks/useModalAccessibility";
import type { ProductItem, ProductSpec } from "@/types/catalog";

const CATEGORY_OPTIONS = [
  { value: "seating", label: "Seating Solutions" },
  { value: "desks", label: "Student Desks & Tables" },
  { value: "storage", label: "Safes, Lockers & Storage" },
];

const CATEGORY_NAMES: Record<ProductMediaCategory, string> = {
  seating: "Ergonomic Office Chairs",
  desks: "Modern Student Desks",
  storage: "Safes, Steel Lockers & Storage",
};

const STEPS = [
  { label: "Basics", hint: "Name and category" },
  { label: "Photos", hint: "Upload product images" },
  { label: "Publish", hint: "Details and visibility" },
];

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const STORAGE_IMAGE_PREFIX = "/storage/v1/object/public/product-images/";

export interface ProductEditorInput {
  title: string;
  category: ProductMediaCategory;
  categoryName: string;
  desc: string;
  fullDesc: string;
  image: string;
  gallery: string[];
  priceNote: string;
  features: string[];
  specs: ProductSpec[];
  isAvailable: boolean;
  isVisible: boolean;
  isBestseller: boolean;
  isClearance: boolean;
  clearanceNote: string;
}

interface ProductEditorModalProps {
  product: ProductItem | null;
  isSaving: boolean;
  error: string;
  onClose: () => void;
  onSave: (input: ProductEditorInput) => Promise<void>;
}

interface PublishToggleProps {
  checked: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onChange: (checked: boolean) => void;
}

function isProductCategory(value: string): value is ProductMediaCategory {
  return value === "seating" || value === "desks" || value === "storage";
}

function isValidImageSource(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    const configuredOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : null;
    return (
      url.protocol === "https:" &&
      (url.hostname.endsWith(".supabase.co") || url.origin === configuredOrigin) &&
      url.pathname.startsWith(STORAGE_IMAGE_PREFIX)
    );
  } catch {
    return false;
  }
}

function uniquePaths(paths: string[]) {
  return Array.from(new Set(paths.map((path) => path.trim()).filter(Boolean)));
}

function PublishToggle({
  checked,
  title,
  description,
  icon,
  onChange,
}: PublishToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-20 w-full items-center gap-3 rounded-custom-md border p-3 text-left transition-all cursor-pointer ${
        checked
          ? "border-brand-accent/45 bg-brand-accent/8 shadow-soft-sm"
          : "border-brand-border bg-white hover:border-neutral-300"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-custom-md ${
          checked ? "bg-brand-accent text-white" : "bg-brand-bg-warm text-brand-secondary"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-brand-dark-bg">{title}</span>
        <span className="mt-0.5 block text-[10px] leading-relaxed text-brand-secondary">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand-accent" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function ProductEditorModal({
  product,
  isSaving,
  error,
  onClose,
  onSave,
}: ProductEditorModalProps) {
  const initialCategory =
    product && isProductCategory(product.category) ? product.category : "seating";
  const initialImage = product?.image ?? "";

  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState(product?.title ?? "");
  const [category, setCategory] = useState<ProductMediaCategory>(initialCategory);
  const [categoryName, setCategoryName] = useState(
    product?.categoryName ?? CATEGORY_NAMES[initialCategory]
  );
  const [description, setDescription] = useState(product?.desc ?? "");
  const [fullDescription, setFullDescription] = useState(product?.fullDesc ?? "");
  const [priceNote, setPriceNote] = useState(product?.priceNote ?? "Direct Factory Pricing");
  const [primaryImage, setPrimaryImage] = useState(initialImage);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    uniquePaths(product?.gallery ?? []).filter((path) => path !== initialImage)
  );
  const [features, setFeatures] = useState<string[]>(product?.features ?? []);
  const [specs, setSpecs] = useState<ProductSpec[]>(
    product?.specs.map((spec) => ({ ...spec })) ?? []
  );
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [isVisible, setIsVisible] = useState(product?.isVisible ?? true);
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller ?? false);
  const [isClearance, setIsClearance] = useState(product?.isClearance ?? false);
  const [clearanceNote, setClearanceNote] = useState(product?.clearanceNote ?? "");
  const [showLibrary, setShowLibrary] = useState(false);
  const [showAdvancedPath, setShowAdvancedPath] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(Boolean(product));
  const [customImagePath, setCustomImagePath] = useState("");
  const [validatedStep, setValidatedStep] = useState(-1);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requestClose = () => {
    if (!isSaving && !isUploading) onClose();
  };

  useModalAccessibility({
    isOpen: true,
    onClose: requestClose,
    containerRef: dialogRef,
  });

  const titleInvalid = title.trim().length < 2;
  const categoryNameInvalid = categoryName.trim().length < 2;
  const descriptionInvalid = description.trim().length < 10;
  const primaryImageInvalid = !isValidImageSource(primaryImage.trim());
  const galleryInvalid = galleryImages.some(
    (path) => path.trim() && !isValidImageSource(path.trim())
  );
  const priceNoteInvalid = priceNote.trim().length < 2;
  const fullDescriptionInvalid =
    fullDescription.trim().length > 0 && fullDescription.trim().length < 10;
  const specsInvalid = specs.some(
    (spec) => Boolean(spec.label.trim()) !== Boolean(spec.value.trim())
  );
  const clearanceInvalid = isClearance && clearanceNote.trim().length < 2;
  const basicsInvalid = titleInvalid || descriptionInvalid;
  const photosInvalid = primaryImageInvalid || galleryInvalid;
  const publishInvalid =
    categoryNameInvalid ||
    priceNoteInvalid ||
    fullDescriptionInvalid ||
    specsInvalid ||
    clearanceInvalid;
  const formInvalid = basicsInvalid || photosInvalid || publishInvalid;

  const cleanFeatures = features.map((feature) => feature.trim()).filter(Boolean);
  const cleanSpecs = specs
    .map((spec) => ({ label: spec.label.trim(), value: spec.value.trim() }))
    .filter((spec) => spec.label && spec.value);
  const allPhotos = uniquePaths([primaryImage, ...galleryImages]).filter(isValidImageSource);
  const categoryAssets = PRODUCT_MEDIA_ASSETS.filter((asset) => asset.category === category);
  const readiness = [!basicsInvalid, !photosInvalid, !publishInvalid].filter(Boolean).length;

  const focusField = (selector: string) => {
    window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: false });
    });
  };

  const addPhoto = (path: string) => {
    const cleanPath = path.trim();
    if (!isValidImageSource(cleanPath)) {
      setUploadError("Use an uploaded image or a valid deployed asset path.");
      return;
    }
    setUploadError("");
    if (!primaryImage.trim()) {
      setPrimaryImage(cleanPath);
      return;
    }
    if (cleanPath === primaryImage.trim() || galleryImages.includes(cleanPath)) return;
    if (galleryImages.length >= 11) {
      setUploadError("A product can have up to 12 photos.");
      return;
    }
    setGalleryImages((current) => [...current, cleanPath]);
  };

  const makeCover = (path: string) => {
    const oldCover = primaryImage.trim();
    setPrimaryImage(path);
    setGalleryImages((current) =>
      uniquePaths([
        ...(oldCover && oldCover !== path ? [oldCover] : []),
        ...current.filter((image) => image !== path),
      ]).slice(0, 11)
    );
  };

  const removePhoto = (path: string) => {
    if (path === primaryImage.trim()) {
      const remaining = galleryImages.filter((image) => image !== path);
      setPrimaryImage(remaining[0] ?? "");
      setGalleryImages(remaining.slice(1));
      return;
    }
    setGalleryImages((current) => current.filter((image) => image !== path));
  };

  const applyUploadedPhotos = (urls: string[]) => {
    if (!urls.length) return;
    const oldCover = primaryImage.trim();
    const newCover = urls[0];
    setPrimaryImage(newCover);
    setGalleryImages((current) =>
      uniquePaths([
        ...(oldCover && oldCover !== newCover ? [oldCover] : []),
        ...current.filter((image) => image !== newCover),
        ...urls.slice(1),
      ]).slice(0, 11)
    );
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length || isUploading) return;
    const selectedFiles = files.slice(0, 12);
    const invalidFile = selectedFiles.find(
      (file) => !ACCEPTED_IMAGE_TYPES.has(file.type) || file.size <= 0 || file.size > MAX_IMAGE_BYTES
    );
    if (invalidFile) {
      setUploadError("Use JPG, PNG, or WebP files smaller than 10 MB each.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadProgress({ current: 0, total: selectedFiles.length });
    const uploadedUrls: string[] = [];

    try {
      for (let index = 0; index < selectedFiles.length; index += 1) {
        const body = new FormData();
        body.append("file", selectedFiles[index]);
        const uploadResponse = await fetch("/api/admin/product-images", {
          method: "POST",
          body,
        });
        const result = (await uploadResponse.json()) as { url?: string; error?: string };
        if (!uploadResponse.ok || !result.url) {
          throw new Error(result.error || "The image upload failed.");
        }
        uploadedUrls.push(result.url);
        setUploadProgress({ current: index + 1, total: selectedFiles.length });
      }
      applyUploadedPhotos(uploadedUrls);
    } catch (uploadFailure) {
      applyUploadedPhotos(uploadedUrls);
      setUploadError(
        uploadFailure instanceof Error
          ? uploadFailure.message
          : "The image upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void uploadFiles(Array.from(event.dataTransfer.files));
  };

  const handleCategoryChange = (value: string) => {
    if (!isProductCategory(value)) return;
    const oldDefault = CATEGORY_NAMES[category];
    setCategory(value);
    if (!categoryName.trim() || categoryName === oldDefault) {
      setCategoryName(CATEGORY_NAMES[value]);
    }
  };

  const navigateToStep = (nextStep: number) => {
    if (nextStep <= activeStep) {
      setActiveStep(nextStep);
      return;
    }
    if (nextStep > 0 && basicsInvalid) {
      setValidatedStep((current) => Math.max(current, 0));
      setActiveStep(0);
      focusField("#product-title");
      return;
    }
    if (nextStep > 1 && photosInvalid) {
      setValidatedStep((current) => Math.max(current, 1));
      setActiveStep(1);
      focusField("#product-photo-upload");
      return;
    }
    setValidatedStep((current) => Math.max(current, activeStep));
    setActiveStep(nextStep);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || isUploading) return;
    setValidatedStep(2);

    if (formInvalid) {
      if (basicsInvalid) {
        setActiveStep(0);
        focusField("[aria-invalid='true']");
      } else if (photosInvalid) {
        setActiveStep(1);
        focusField("#product-photo-upload");
      } else {
        setShowOptionalDetails(true);
        setActiveStep(2);
        focusField("[aria-invalid='true']");
      }
      return;
    }

    const image = primaryImage.trim();
    await onSave({
      title: title.trim(),
      category,
      categoryName: categoryName.trim(),
      desc: description.trim(),
      fullDesc: fullDescription.trim() || description.trim(),
      image,
      gallery: uniquePaths([image, ...galleryImages]),
      priceNote: priceNote.trim(),
      features: cleanFeatures,
      specs: cleanSpecs,
      isAvailable,
      isVisible,
      isBestseller,
      isClearance,
      clearanceNote: isClearance ? clearanceNote.trim() : "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sans sm:p-4">
      <button
        type="button"
        aria-label="Close product editor"
        onClick={requestClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-editor-title"
        tabIndex={-1}
        className="relative z-10 flex h-[100dvh] w-full max-w-[1080px] flex-col overflow-hidden bg-background shadow-2xl outline-none sm:h-[94vh] sm:rounded-[28px] sm:border sm:border-white/20"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-brand-border bg-white px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-custom-md bg-brand-dark-bg text-brand-accent">
              <PackageCheck size={18} />
            </span>
            <div className="min-w-0">
              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent sm:block">
                Product catalog
              </p>
              <h2
                id="product-editor-title"
                className="truncate font-display text-lg font-bold tracking-tight text-brand-dark-bg"
              >
                {product ? "Edit product" : "Add a new product"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={isSaving || isUploading}
            aria-label="Close product editor"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white text-brand-secondary transition-colors hover:bg-brand-bg-warm hover:text-brand-dark-bg disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <nav
            aria-label="Product editor steps"
            className="shrink-0 border-b border-brand-border bg-white px-3 py-2 sm:px-6"
          >
            <div className="mx-auto grid max-w-2xl grid-cols-3 gap-1 rounded-custom-md bg-brand-bg-warm p-1">
              {STEPS.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => navigateToStep(index)}
                  aria-current={activeStep === index ? "step" : undefined}
                  className={`flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-left transition-all cursor-pointer ${
                    activeStep === index
                      ? "bg-white text-brand-dark-bg shadow-soft-sm"
                      : "text-brand-secondary hover:text-brand-dark-bg"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                      activeStep === index
                        ? "bg-brand-accent text-white"
                        : index < activeStep
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-white text-brand-secondary"
                    }`}
                  >
                    {index < activeStep ? <Check size={11} strokeWidth={3} /> : index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10px] font-semibold sm:text-xs">
                      {step.label}
                    </span>
                    <span className="hidden truncate text-[9px] text-brand-secondary sm:block">
                      {step.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </nav>

          <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_310px] lg:overflow-hidden">
            <main className="p-4 sm:p-6 lg:overflow-y-auto lg:p-8">
              {activeStep === 0 && (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-custom-md bg-brand-accent/10 text-brand-accent">
                      <Sparkles size={18} />
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-brand-dark-bg">
                      Start with the essentials
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-secondary">
                      Buyers only need a clear name, category, and short summary to understand the item.
                    </p>
                  </div>

                  <div className="space-y-5 rounded-custom-xl border border-brand-border bg-white p-5 shadow-soft-sm sm:p-7">
                    <Input
                      id="product-title"
                      label="Product name *"
                      data-autofocus
                      value={title}
                      maxLength={160}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. Atlas High-Back Mesh Chair"
                      error={validatedStep >= 0 && titleInvalid ? "Enter a product name." : undefined}
                    />

                    <Select
                      id="product-category"
                      label="Category"
                      options={CATEGORY_OPTIONS}
                      value={category}
                      onChange={(event) => handleCategoryChange(event.target.value)}
                    />

                    <div>
                      <Textarea
                        id="product-description"
                        label="Short description *"
                        rows={4}
                        value={description}
                        maxLength={300}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Explain the product's main benefit in one or two sentences."
                        error={
                          validatedStep >= 0 && descriptionInvalid
                            ? "Write at least 10 characters."
                            : undefined
                        }
                        className="min-h-[120px]"
                      />
                      <p className="mt-1.5 text-right text-[10px] text-brand-secondary">
                        {description.length}/300
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="mx-auto max-w-3xl">
                  <div className="mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-custom-md bg-brand-accent/10 text-brand-accent">
                      <Images size={18} />
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-brand-dark-bg">
                      Add product photos
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-secondary">
                      Select files from your computer or phone. The first uploaded photo becomes the cover.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                      void uploadFiles(Array.from(event.target.files ?? []));
                      event.target.value = "";
                    }}
                  />

                  <div
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`rounded-custom-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
                      isDragging
                        ? "border-brand-accent bg-brand-accent/10"
                        : validatedStep >= 1 && primaryImageInvalid
                          ? "border-rose-300 bg-rose-50"
                          : "border-brand-border bg-white"
                    }`}
                  >
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-bg-warm text-brand-accent">
                      {isUploading ? (
                        <LoaderCircle size={24} className="animate-spin" />
                      ) : (
                        <UploadCloud size={24} />
                      )}
                    </span>
                    <h4 className="mt-4 font-display text-lg font-semibold text-brand-dark-bg">
                      {isUploading
                        ? `Uploading ${Math.min(uploadProgress.current + 1, uploadProgress.total)} of ${uploadProgress.total}`
                        : "Drop photos here"}
                    </h4>
                    <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-brand-secondary">
                      JPG, PNG, or WebP. Up to 10 MB each. Images are automatically resized and optimized.
                    </p>
                    <button
                      id="product-photo-upload"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-brand-dark-bg px-5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                    >
                      <UploadCloud size={15} />
                      Choose photos
                    </button>
                    {validatedStep >= 1 && primaryImageInvalid && (
                      <p role="alert" className="mt-3 text-xs font-medium text-rose-600">
                        Add at least one product photo.
                      </p>
                    )}
                  </div>

                  {uploadError && (
                    <div role="alert" className="mt-3 rounded-custom-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                      {uploadError}
                    </div>
                  )}

                  {allPhotos.length > 0 && (
                    <div className="mt-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-brand-dark-bg">
                            Product photos
                          </h4>
                          <p className="mt-0.5 text-[10px] text-brand-secondary">
                            {allPhotos.length}/12 images · Star marks the storefront cover
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:text-brand-dark-bg cursor-pointer"
                        >
                          <Plus size={13} /> Add more
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {allPhotos.map((photo) => {
                          const isCover = photo === primaryImage.trim();
                          return (
                            <div
                              key={photo}
                              className={`group overflow-hidden rounded-custom-md border bg-white p-1.5 ${
                                isCover
                                  ? "border-brand-accent ring-1 ring-brand-accent"
                                  : "border-brand-border"
                              }`}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-bg-warm">
                                <Image
                                  src={photo}
                                  alt=""
                                  fill
                                  sizes="(max-width: 640px) 45vw, 220px"
                                  className="object-cover"
                                />
                                {isCover && (
                                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-dark-bg/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">
                                    <Star size={9} fill="currentColor" /> Cover
                                  </span>
                                )}
                              </div>
                              <div className="mt-1.5 flex items-center justify-between gap-1">
                                {!isCover ? (
                                  <button
                                    type="button"
                                    onClick={() => makeCover(photo)}
                                    className="inline-flex items-center gap-1 px-1 text-[9px] font-semibold text-brand-secondary hover:text-brand-accent cursor-pointer"
                                  >
                                    <Star size={10} /> Make cover
                                  </button>
                                ) : (
                                  <span className="px-1 text-[9px] font-semibold text-brand-accent">
                                    Storefront cover
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removePhoto(photo)}
                                  aria-label="Remove product photo"
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-secondary hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setShowLibrary((current) => !current)}
                      className="flex items-center justify-between rounded-custom-md border border-brand-border bg-white px-4 py-3 text-left text-xs font-semibold text-brand-dark-bg hover:border-brand-accent cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Images size={15} className="text-brand-accent" /> Use website library
                      </span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${showLibrary ? "rotate-90" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedPath((current) => !current)}
                      className="flex items-center justify-between rounded-custom-md border border-brand-border bg-white px-4 py-3 text-left text-xs font-semibold text-brand-dark-bg hover:border-brand-accent cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Settings2 size={15} className="text-brand-accent" /> Advanced image path
                      </span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${showAdvancedPath ? "rotate-90" : ""}`}
                      />
                    </button>
                  </div>

                  {showLibrary && (
                    <div className="mt-3 rounded-custom-lg border border-brand-border bg-white p-4">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-brand-secondary">
                        Tap an existing photo to add it
                      </p>
                      <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                        {categoryAssets.map((asset) => {
                          const selected = allPhotos.includes(asset.path);
                          return (
                            <button
                              key={asset.path}
                              type="button"
                              disabled={selected}
                              onClick={() => addPhoto(asset.path)}
                              aria-label={`Add ${getProductMediaLabel(asset.path)}`}
                              className={`relative aspect-square overflow-hidden rounded-lg border cursor-pointer ${
                                selected
                                  ? "border-brand-accent opacity-55"
                                  : "border-brand-border hover:border-brand-accent"
                              }`}
                            >
                              <Image
                                src={asset.path}
                                alt=""
                                fill
                                sizes="100px"
                                className="object-cover"
                              />
                              {selected && (
                                <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                                  <Check size={18} strokeWidth={3} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {showAdvancedPath && (
                    <div className="mt-3 flex items-end gap-2 rounded-custom-lg border border-brand-border bg-white p-4">
                      <Input
                        label="Deployed image path"
                        value={customImagePath}
                        maxLength={1000}
                        onChange={(event) => setCustomImagePath(event.target.value)}
                        placeholder="/pics/product.jpeg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          addPhoto(customImagePath);
                          if (isValidImageSource(customImagePath.trim())) setCustomImagePath("");
                        }}
                        className="mb-0.5 shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeStep === 2 && (
                <div className="mx-auto max-w-3xl space-y-5">
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-custom-md bg-brand-accent/10 text-brand-accent">
                      <CircleCheck size={18} />
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-brand-dark-bg">
                      Review and publish
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-secondary">
                      Choose where the product appears. Everything else on this page is optional.
                    </p>
                  </div>

                  <section className="rounded-custom-xl border border-brand-border bg-white p-5 shadow-soft-sm sm:p-6">
                    <h4 className="text-sm font-semibold text-brand-dark-bg">Storefront settings</h4>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <PublishToggle
                        checked={isVisible}
                        onChange={setIsVisible}
                        icon={<Eye size={16} />}
                        title="Visible on website"
                        description="Buyers can find this product."
                      />
                      <PublishToggle
                        checked={isAvailable}
                        onChange={setIsAvailable}
                        icon={<PackageCheck size={16} />}
                        title="Available for supply"
                        description="Ready for quote requests."
                      />
                      <PublishToggle
                        checked={isBestseller}
                        onChange={setIsBestseller}
                        icon={<Sparkles size={16} />}
                        title="Feature as bestseller"
                        description="Highlight in curated sections."
                      />
                      <PublishToggle
                        checked={isClearance}
                        onChange={setIsClearance}
                        icon={<BadgePercent size={16} />}
                        title="Add to clearance"
                        description="Show on the clearance page."
                      />
                    </div>
                    {isClearance && (
                      <div className="mt-4">
                        <Input
                          id="product-clearance-note"
                          label="Clearance label *"
                          value={clearanceNote}
                          maxLength={120}
                          onChange={(event) => setClearanceNote(event.target.value)}
                          placeholder="e.g. 25% OFF - Floor Models"
                          error={
                            validatedStep >= 2 && clearanceInvalid
                              ? "Add the discount label buyers will see."
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </section>

                  <section className="rounded-custom-xl border border-brand-border bg-white p-5 shadow-soft-sm sm:p-6">
                    <Input
                      id="product-price-note"
                      label="Pricing note"
                      value={priceNote}
                      maxLength={100}
                      onChange={(event) => setPriceNote(event.target.value)}
                      placeholder="e.g. Institutional Volume Pricing"
                      error={
                        validatedStep >= 2 && priceNoteInvalid ? "Add a short pricing note." : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowOptionalDetails((current) => !current)}
                      className="mt-5 flex w-full items-center justify-between border-t border-brand-border pt-5 text-left cursor-pointer"
                    >
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-brand-dark-bg">
                          <ListChecks size={16} className="text-brand-accent" /> Optional product details
                        </span>
                        <span className="mt-1 block text-[10px] text-brand-secondary">
                          Long description, features, and technical specifications
                        </span>
                      </span>
                      <ChevronRight
                        size={15}
                        className={`transition-transform ${showOptionalDetails ? "rotate-90" : ""}`}
                      />
                    </button>

                    {showOptionalDetails && (
                      <div className="mt-5 space-y-6 border-t border-brand-border pt-5">
                        <Input
                          id="product-category-name"
                          label="Custom category label"
                          value={categoryName}
                          maxLength={120}
                          onChange={(event) => setCategoryName(event.target.value)}
                          error={
                            validatedStep >= 2 && categoryNameInvalid
                              ? "Enter the label buyers will see."
                              : undefined
                          }
                        />
                        <Textarea
                          id="product-full-description"
                          label="Detailed description"
                          rows={4}
                          value={fullDescription}
                          maxLength={3000}
                          onChange={(event) => setFullDescription(event.target.value)}
                          placeholder="Materials, construction, use cases, and procurement details."
                          error={
                            validatedStep >= 2 && fullDescriptionInvalid
                              ? "Use at least 10 characters or leave blank."
                              : undefined
                          }
                        />

                        <div>
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-brand-dark-bg">Key features</p>
                              <p className="mt-0.5 text-[10px] text-brand-secondary">
                                One buyer benefit per row
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFeatures((current) => [...current, ""])}
                              disabled={features.length >= 20}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent disabled:opacity-50 cursor-pointer"
                            >
                              <Plus size={12} /> Add feature
                            </button>
                          </div>
                          {features.length ? (
                            <div className="space-y-2">
                              {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Input
                                    aria-label={`Feature ${index + 1}`}
                                    value={feature}
                                    maxLength={240}
                                    onChange={(event) =>
                                      setFeatures((current) =>
                                        current.map((item, itemIndex) =>
                                          itemIndex === index ? event.target.value : item
                                        )
                                      )
                                    }
                                    placeholder="e.g. Breathable mesh backrest"
                                    className="py-2.5"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFeatures((current) =>
                                        current.filter((_, itemIndex) => itemIndex !== index)
                                      )
                                    }
                                    aria-label={`Remove feature ${index + 1}`}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-border text-brand-secondary hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="rounded-custom-md bg-brand-bg-warm/60 p-3 text-[10px] text-brand-secondary">
                              No features added. This is optional.
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-brand-dark-bg">
                                Technical specifications
                              </p>
                              <p className="mt-0.5 text-[10px] text-brand-secondary">
                                Add label and value pairs
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setSpecs((current) => [...current, { label: "", value: "" }])
                              }
                              disabled={specs.length >= 20}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent disabled:opacity-50 cursor-pointer"
                            >
                              <Plus size={12} /> Add specification
                            </button>
                          </div>
                          {specs.length ? (
                            <div className="space-y-2">
                              {specs.map((spec, index) => {
                                const incomplete =
                                  validatedStep >= 2 &&
                                  Boolean(spec.label.trim()) !== Boolean(spec.value.trim());
                                return (
                                  <div
                                    key={index}
                                    className="grid gap-2 rounded-custom-md bg-brand-bg-warm/50 p-3 sm:grid-cols-[0.75fr_1.25fr_auto]"
                                  >
                                    <Input
                                      aria-label={`Specification ${index + 1} label`}
                                      value={spec.label}
                                      maxLength={80}
                                      onChange={(event) =>
                                        setSpecs((current) =>
                                          current.map((item, itemIndex) =>
                                            itemIndex === index
                                              ? { ...item, label: event.target.value }
                                              : item
                                          )
                                        )
                                      }
                                      placeholder="Warranty"
                                      error={incomplete && !spec.label.trim() ? "Add label." : undefined}
                                      className="py-2.5"
                                    />
                                    <Input
                                      aria-label={`Specification ${index + 1} value`}
                                      value={spec.value}
                                      maxLength={240}
                                      onChange={(event) =>
                                        setSpecs((current) =>
                                          current.map((item, itemIndex) =>
                                            itemIndex === index
                                              ? { ...item, value: event.target.value }
                                              : item
                                          )
                                        )
                                      }
                                      placeholder="2-Year Warranty"
                                      error={incomplete && !spec.value.trim() ? "Add value." : undefined}
                                      className="py-2.5"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSpecs((current) =>
                                          current.filter((_, itemIndex) => itemIndex !== index)
                                        )
                                      }
                                      aria-label={`Remove specification ${index + 1}`}
                                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-white text-brand-secondary hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="rounded-custom-md bg-brand-bg-warm/60 p-3 text-[10px] text-brand-secondary">
                              No specifications added. This is optional.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </main>

            <aside className="hidden border-l border-brand-border bg-[#f1ece4] p-5 lg:block lg:overflow-y-auto">
              <div className="sticky top-0 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                      Live preview
                    </p>
                    <h3 className="mt-0.5 font-display text-base font-semibold text-brand-dark-bg">
                      Storefront card
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider ${
                      isVisible
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>

                <div className="overflow-hidden rounded-custom-lg border border-brand-border bg-white shadow-soft-md">
                  <div className="relative aspect-[4/3] bg-brand-bg-warm">
                    {!primaryImageInvalid ? (
                      <Image
                        src={primaryImage.trim()}
                        alt=""
                        fill
                        sizes="310px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-secondary">
                        <ImageIcon size={26} className="text-brand-accent" />
                        <span className="text-[10px]">Product photo</span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      {isBestseller && (
                        <span className="rounded-full bg-brand-dark-bg px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">
                          Bestseller
                        </span>
                      )}
                      {isClearance && (
                        <span className="rounded-full bg-rose-600 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">
                          Clearance
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                      {categoryName.trim() || CATEGORY_NAMES[category]}
                    </p>
                    <h4 className="mt-1.5 font-display text-base font-semibold leading-snug text-brand-dark-bg">
                      {title.trim() || "Your product name"}
                    </h4>
                    <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed text-brand-secondary">
                      {description.trim() || "Your short product description will appear here."}
                    </p>
                    <div className="mt-4 border-t border-brand-border pt-3 text-[9px] font-semibold text-brand-dark-bg">
                      {priceNote.trim() || "Pricing note"}
                    </div>
                  </div>
                </div>

                <div className="rounded-custom-lg border border-brand-border bg-white p-4 shadow-soft-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                        Product readiness
                      </p>
                      <p className="mt-1 text-xs font-semibold text-brand-dark-bg">
                        {readiness} of 3 sections ready
                      </p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg-warm text-brand-accent">
                      <CircleCheck size={15} />
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-brand-accent transition-[width]"
                      style={{ width: `${(readiness / 3) * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-brand-secondary">
                    <span>{allPhotos.length} photos</span>
                    <span>{cleanFeatures.length} features</span>
                  </div>
                </div>

                <div className="rounded-custom-md border border-brand-accent/25 bg-brand-accent/10 p-3 text-[10px] leading-relaxed text-brand-secondary">
                  Saving updates the catalog immediately. Turn visibility off if you want to review it first.
                </div>
              </div>
            </aside>
          </div>

          {error && (
            <div role="alert" className="shrink-0 border-t border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-medium text-rose-700 sm:px-7">
              {error}
            </div>
          )}

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-brand-border bg-white px-4 py-3 sm:px-6">
            <div className="hidden text-[10px] text-brand-secondary sm:block">
              Step {activeStep + 1} of {STEPS.length}
            </div>
            <div className="ml-auto flex w-full items-center justify-end gap-2.5 sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => (activeStep === 0 ? requestClose() : setActiveStep((step) => step - 1))}
                disabled={isSaving || isUploading}
                className="min-h-11 min-w-[92px] gap-1.5"
              >
                {activeStep > 0 && <ArrowLeft size={13} />}
                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>
              {activeStep < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  onClick={() => navigateToStep(activeStep + 1)}
                  disabled={isUploading}
                  className="min-h-11 min-w-[120px] gap-1.5"
                >
                  Continue <ChevronRight size={13} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="min-h-11 min-w-[132px] gap-2"
                >
                  {isSaving && <LoaderCircle size={14} className="animate-spin" />}
                  {isSaving ? "Saving..." : product ? "Save product" : "Create product"}
                </Button>
              )}
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
