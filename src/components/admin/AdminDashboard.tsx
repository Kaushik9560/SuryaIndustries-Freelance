"use client";

import { startTransition, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Boxes,
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  archiveLeadAction,
  createProductAction,
  deleteProductAction,
  logoutAdmin,
  setProductFlagsAction,
  updateProductAction,
} from "@/app/admin/actions";
import {
  ProductEditorModal,
  type ProductEditorInput,
} from "@/components/admin/ProductEditorModal";
import { Button } from "@/components/ui/Button";
import type { ProductItem } from "@/types/catalog";
import type { NotifyLead, QuoteLead } from "@/types/leads";

type AdminTab = "products" | "quotes" | "notifications";

interface AdminDashboardProps {
  initialProducts: ProductItem[];
  initialQuotes: QuoteLead[];
  initialNotifications: NotifyLead[];
  adminName: string;
}

interface MetricCardProps {
  label: string;
  value: number;
  helper: string;
  icon: ReactNode;
  tone: "gold" | "green" | "amber" | "blue";
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const METRIC_TONES = {
  gold: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  blue: "bg-sky-50 text-sky-700 border-sky-100",
};

function MetricCard({ label, value, helper, icon, tone }: MetricCardProps) {
  return (
    <article className="rounded-custom-lg border border-brand-border bg-white p-4 shadow-soft-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-secondary sm:text-[10px]">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-dark-bg">
            {value}
          </p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-custom-md border ${METRIC_TONES[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 hidden text-[10px] leading-relaxed text-brand-secondary sm:block">
        {helper}
      </p>
    </article>
  );
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-custom-xl border border-dashed border-brand-border bg-white px-6 py-14 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-bg-warm text-brand-accent">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-brand-dark-bg">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-brand-secondary">
        {description}
      </p>
    </div>
  );
}

function EmailStatusBadge({ status }: { status: string }) {
  const config =
    status === "sent"
      ? { label: "Owner notified", className: "bg-emerald-50 text-emerald-700" }
      : status === "failed"
        ? { label: "Email failed", className: "bg-rose-50 text-rose-700" }
        : status === "not_configured"
          ? { label: "Email not set", className: "bg-neutral-100 text-neutral-600" }
          : { label: "Email pending", className: "bg-amber-50 text-amber-700" };

  return (
    <span className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}

function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminDashboard({
  initialProducts,
  initialQuotes,
  initialNotifications,
  adminName,
}: AdminDashboardProps) {
  const [products, setProducts] = useState(initialProducts);
  const [quoteRequests, setQuoteRequests] = useState(initialQuotes);
  const [notifyRequests, setNotifyRequests] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const closeEditor = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setMutationError("");
  };

  const openAddModal = () => {
    setMutationError("");
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setMutationError("");
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productPayload: ProductEditorInput) => {
    if (isSaving) return;
    setIsSaving(true);
    setMutationError("");
    const result = editingProduct
      ? await updateProductAction(editingProduct.id, productPayload)
      : await createProductAction(productPayload);
    setIsSaving(false);

    if (!result.ok) {
      setMutationError(result.error);
      return;
    }

    startTransition(() => {
      setProducts((current) =>
        editingProduct
          ? current.map((product) =>
              product.id === result.product.id ? result.product : product
            )
          : [...current, result.product]
      );
      closeEditor();
    });
  };

  const updateProductFlags = async (
    product: ProductItem,
    flags: { isAvailable?: boolean; isVisible?: boolean }
  ) => {
    setMutationError("");
    const result = await setProductFlagsAction(product.id, flags);
    if (!result.ok) {
      setMutationError(result.error);
      return;
    }
    startTransition(() => {
      setProducts((current) =>
        current.map((item) => (item.id === result.product.id ? result.product : item))
      );
    });
  };

  const removeProduct = async (product: ProductItem) => {
    if (!window.confirm(`Delete "${product.title}" from the catalog?`)) return;
    setMutationError("");
    const result = await deleteProductAction(product.id);
    if (!result.ok) {
      setMutationError(result.error);
      return;
    }
    startTransition(() => {
      setProducts((current) => current.filter((item) => item.id !== product.id));
    });
  };

  const archiveLead = async (kind: "quote" | "notification", id: string) => {
    setMutationError("");
    const result = await archiveLeadAction(kind, id);
    if (!result.ok) {
      setMutationError(result.error);
      return;
    }
    startTransition(() => {
      if (kind === "quote") {
        setQuoteRequests((current) => current.filter((request) => request.id !== id));
      } else {
        setNotifyRequests((current) => current.filter((request) => request.id !== id));
      }
    });
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      !normalizedSearch ||
      product.title.toLowerCase().includes(normalizedSearch) ||
      product.categoryName.toLowerCase().includes(normalizedSearch)
  );
  const activeProducts = products.filter(
    (product) => product.isAvailable && product.isVisible !== false
  ).length;
  const firstName = adminName.split(/\s|@/)[0] || "Owner";

  const tabs: Array<{
    id: AdminTab;
    label: string;
    shortLabel: string;
    count: number;
    icon: ReactNode;
  }> = [
    {
      id: "products",
      label: "Product catalog",
      shortLabel: "Products",
      count: products.length,
      icon: <Boxes size={15} />,
    },
    {
      id: "quotes",
      label: "Quote requests",
      shortLabel: "Quotes",
      count: quoteRequests.length,
      icon: <FileText size={15} />,
    },
    {
      id: "notifications",
      label: "Restock interest",
      shortLabel: "Restock",
      count: notifyRequests.length,
      icon: <Bell size={15} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f2ec] font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-dark-bg/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-custom-md bg-brand-accent font-display text-sm font-bold text-white">
              S
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-white sm:text-base">
                Surya Industries
              </p>
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Owner workspace · {adminName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open public website"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[10px] font-semibold text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View website</span>
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                aria-label="Log out"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-rose-400/15 bg-rose-400/10 px-3 text-[10px] font-semibold text-rose-200 transition-colors hover:bg-rose-400/20 cursor-pointer"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
        <section className="relative overflow-hidden rounded-[26px] bg-brand-dark-bg p-6 text-white shadow-soft-lg sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
                <LayoutDashboard size={13} /> Owner dashboard
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, {firstName}
              </h1>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-neutral-400 sm:text-sm">
                Manage the catalog, respond to buyers, and keep every product ready for procurement.
              </p>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={openAddModal}
              className="w-full gap-2 sm:w-auto"
            >
              <Plus size={16} /> Add product
            </Button>
          </div>
        </section>

        <section aria-label="Catalog overview" className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-4 lg:gap-4">
          <MetricCard
            label="Products"
            value={products.length}
            helper="All products currently stored in your catalog."
            icon={<Package size={19} />}
            tone="gold"
          />
          <MetricCard
            label="Live"
            value={activeProducts}
            helper="Visible products marked ready for supply."
            icon={<CheckCircle2 size={19} />}
            tone="green"
          />
          <MetricCard
            label="Quotes"
            value={quoteRequests.length}
            helper="Buyer enquiries waiting in the owner inbox."
            icon={<FileText size={19} />}
            tone="amber"
          />
          <MetricCard
            label="Restock"
            value={notifyRequests.length}
            helper="Buyers waiting for unavailable products."
            icon={<Bell size={19} />}
            tone="blue"
          />
        </section>

        <section className="mt-5 overflow-hidden rounded-[24px] border border-brand-border bg-white/70 shadow-soft-sm backdrop-blur sm:mt-6">
          <div className="border-b border-brand-border bg-white/95 p-2 sm:p-3">
            <nav aria-label="Admin sections" className="grid grid-cols-3 gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-custom-md px-2 py-2.5 text-[10px] font-semibold transition-all cursor-pointer sm:gap-2 sm:text-xs ${
                    activeTab === tab.id
                      ? "bg-brand-dark-bg text-white shadow-soft-sm"
                      : "text-brand-secondary hover:bg-brand-bg-warm hover:text-brand-dark-bg"
                  }`}
                >
                  {tab.icon}
                  <span className="truncate sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden truncate sm:inline">{tab.label}</span>
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[8px] font-bold ${
                      activeTab === tab.id
                        ? "bg-brand-accent text-white"
                        : "bg-brand-bg-warm text-brand-secondary"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-5 lg:p-6">
            {activeTab === "products" && (
              <>
                <div className="flex flex-col gap-4 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                      Catalog management
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-bold text-brand-dark-bg">
                      Your products
                    </h2>
                    <p className="mt-1 text-xs text-brand-secondary">
                      Edit details or change availability directly from each card.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <div className="relative min-w-0 flex-1 sm:w-64">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-full border border-brand-border bg-white py-2.5 pl-10 pr-10 text-xs outline-none transition-colors focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          aria-label="Clear product search"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-dark-bg cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openAddModal}
                      className="min-h-11 gap-1.5 whitespace-nowrap"
                    >
                      <Plus size={15} /> New product
                    </Button>
                  </div>
                </div>

                {mutationError && (
                  <div role="alert" className="mt-4 flex items-center gap-2 rounded-custom-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                    <ShieldAlert size={15} className="shrink-0" />
                    <span>{mutationError}</span>
                  </div>
                )}

                {filteredProducts.length ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => {
                      const isVisible = product.isVisible !== false;
                      return (
                        <article
                          key={product.id}
                          className="group overflow-hidden rounded-custom-xl border border-brand-border bg-white shadow-soft-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg-warm">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-brand-dark-bg shadow-sm backdrop-blur">
                                {product.categoryName || product.category}
                              </span>
                              <div className="flex flex-wrap justify-end gap-1.5">
                                {product.isBestseller && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-dark-bg/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                                    <Sparkles size={9} /> Bestseller
                                  </span>
                                )}
                                {product.isClearance && (
                                  <span className="rounded-full bg-rose-600 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">
                                    Clearance
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 sm:p-5">
                            <div className="min-h-[92px]">
                              <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-brand-dark-bg">
                                {product.title}
                              </h3>
                              <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-brand-secondary">
                                {product.desc}
                              </p>
                            </div>
                            <p className="mt-3 border-t border-brand-border/70 pt-3 text-[10px] font-semibold text-brand-accent">
                              {product.priceNote || "Catalog pricing"}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateProductFlags(product, {
                                    isAvailable: !product.isAvailable,
                                  })
                                }
                                aria-label={`Mark ${product.title} ${
                                  product.isAvailable ? "out of stock" : "available"
                                }`}
                                className={`flex min-h-10 items-center justify-center gap-1.5 rounded-custom-md border px-2 py-2 text-[9px] font-semibold transition-colors cursor-pointer ${
                                  product.isAvailable
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                              >
                                <Package size={13} />
                                {product.isAvailable ? "Available" : "Out of stock"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateProductFlags(product, { isVisible: !isVisible })
                                }
                                aria-label={`${isVisible ? "Hide" : "Show"} ${product.title}`}
                                className={`flex min-h-10 items-center justify-center gap-1.5 rounded-custom-md border px-2 py-2 text-[9px] font-semibold transition-colors cursor-pointer ${
                                  isVisible
                                    ? "border-sky-200 bg-sky-50 text-sky-700"
                                    : "border-neutral-200 bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                                {isVisible ? "Visible" : "Hidden"}
                              </button>
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(product)}
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand-dark-bg text-xs font-semibold text-white transition-colors hover:bg-neutral-800 cursor-pointer"
                              >
                                <Edit3 size={14} /> Edit product
                              </button>
                              <button
                                type="button"
                                onClick={() => removeProduct(product)}
                                aria-label={`Delete ${product.title}`}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-5">
                    <EmptyState
                      icon={<Search size={21} />}
                      title="No matching products"
                      description="Try another search phrase or clear the filter to see the complete catalog."
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "quotes" && (
              <>
                <div className="border-b border-brand-border pb-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                    Buyer inbox
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-brand-dark-bg">
                    Quote requests
                  </h2>
                  <p className="mt-1 text-xs text-brand-secondary">
                    Contact buyers and mark completed enquiries as handled.
                  </p>
                </div>

                {mutationError && (
                  <div role="alert" className="mt-4 flex items-center gap-2 rounded-custom-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                    <ShieldAlert size={15} className="shrink-0" />
                    <span>{mutationError}</span>
                  </div>
                )}

                {quoteRequests.length ? (
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {quoteRequests.map((request) => (
                      <article key={request.id} className="rounded-custom-xl border border-brand-border bg-white p-4 shadow-soft-sm sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                              {request.referenceCode}
                            </p>
                            <h3 className="mt-1 font-display text-lg font-semibold text-brand-dark-bg">
                              {request.organization}
                            </h3>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-brand-secondary">
                              <UserRound size={12} /> {request.contactName}
                            </p>
                          </div>
                          <EmailStatusBadge status={request.emailStatus} />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {request.categories.map((category) => (
                            <span key={category} className="rounded-full bg-brand-bg-warm px-2.5 py-1 text-[9px] font-medium text-brand-dark-bg">
                              {category}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                          <div className="rounded-custom-md bg-brand-bg-warm/60 p-3">
                            <span className="block text-brand-secondary">Quantity</span>
                            <span className="mt-1 block font-semibold text-brand-dark-bg">
                              {request.quantity} units
                            </span>
                          </div>
                          <div className="rounded-custom-md bg-brand-bg-warm/60 p-3">
                            <span className="block text-brand-secondary">Timeline</span>
                            <span className="mt-1 block font-semibold text-brand-dark-bg">
                              {request.timeline}
                            </span>
                          </div>
                        </div>

                        {request.details && (
                          <p className="mt-3 rounded-custom-md border border-brand-border bg-white p-3 text-[10px] leading-relaxed text-brand-secondary">
                            {request.details}
                          </p>
                        )}

                        <div className="mt-4 space-y-2 border-t border-brand-border pt-4 text-[10px]">
                          <a href={`mailto:${request.email}`} className="flex items-center gap-2 text-brand-dark-bg hover:text-brand-accent">
                            <Mail size={13} className="text-brand-accent" /> {request.email}
                          </a>
                          <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-brand-dark-bg hover:text-brand-accent">
                            <Phone size={13} className="text-brand-accent" /> {request.phone}
                          </a>
                          <p className="flex items-center gap-2 text-brand-secondary">
                            <MapPin size={13} /> {request.location}
                          </p>
                          <p className="flex items-center gap-2 text-brand-secondary">
                            <Clock3 size={13} /> {formatLeadDate(request.createdAt)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => archiveLead("quote", request.id)}
                          className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-brand-border text-[10px] font-semibold text-brand-dark-bg transition-colors hover:bg-brand-bg-warm cursor-pointer"
                        >
                          <CheckCircle2 size={13} /> Mark as handled
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5">
                    <EmptyState
                      icon={<Inbox size={21} />}
                      title="Quote inbox is clear"
                      description="New quotation requests from the website will appear here automatically."
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <div className="border-b border-brand-border pb-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                    Demand signals
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-brand-dark-bg">
                    Restock interest
                  </h2>
                  <p className="mt-1 text-xs text-brand-secondary">
                    Buyers waiting for unavailable products are grouped here.
                  </p>
                </div>

                {mutationError && (
                  <div role="alert" className="mt-4 flex items-center gap-2 rounded-custom-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                    <ShieldAlert size={15} className="shrink-0" />
                    <span>{mutationError}</span>
                  </div>
                )}

                {notifyRequests.length ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {notifyRequests.map((request) => (
                      <article key={request.id} className="rounded-custom-xl border border-brand-border bg-white p-4 shadow-soft-sm sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-custom-md bg-sky-50 text-sky-700">
                            <Bell size={17} />
                          </span>
                          <EmailStatusBadge status={request.emailStatus} />
                        </div>
                        <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                          {request.referenceCode}
                        </p>
                        <h3 className="mt-1 line-clamp-2 font-display text-lg font-semibold leading-snug text-brand-dark-bg">
                          {request.productTitle}
                        </h3>

                        <div className="mt-4 space-y-2 border-t border-brand-border pt-4 text-[10px]">
                          <a href={`mailto:${request.email}`} className="flex items-center gap-2 break-all text-brand-dark-bg hover:text-brand-accent">
                            <Mail size={13} className="shrink-0 text-brand-accent" /> {request.email}
                          </a>
                          {request.phone && (
                            <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-brand-dark-bg hover:text-brand-accent">
                              <Phone size={13} className="text-brand-accent" /> {request.phone}
                            </a>
                          )}
                          <p className="flex items-center gap-2 text-brand-secondary">
                            <Clock3 size={13} /> {formatLeadDate(request.createdAt)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => archiveLead("notification", request.id)}
                          className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-brand-border text-[10px] font-semibold text-brand-dark-bg transition-colors hover:bg-brand-bg-warm cursor-pointer"
                        >
                          <CheckCircle2 size={13} /> Mark as handled
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5">
                    <EmptyState
                      icon={<Bell size={21} />}
                      title="No restock requests"
                      description="Interest registrations for unavailable products will appear here."
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <ProductEditorModal
          key={editingProduct?.id ?? "new-product"}
          product={editingProduct}
          isSaving={isSaving}
          error={mutationError}
          onClose={closeEditor}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
