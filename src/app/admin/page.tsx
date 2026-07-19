import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, ShieldAlert } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/catalog";
import { getSupabaseAdminConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  robots: { index: false, follow: false },
};

function AdminStatusScreen({ configured }: { configured: boolean }) {
  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-custom-xl p-8 shadow-soft-lg text-center">
        <div className="w-12 h-12 rounded-xl bg-brand-accent mx-auto flex items-center justify-center text-white mb-4 shadow">
          {configured ? <ShieldAlert size={22} /> : <Database size={22} />}
        </div>
        <h1 className="font-display font-bold text-2xl text-white">
          {configured ? "Admin service temporarily unavailable" : "Production backend setup required"}
        </h1>
        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          {configured
            ? "The secure dashboard could not reach its data service. Public catalog pages remain available; please retry shortly."
            : "The insecure browser passcodes have been removed. Connect Supabase and apply the included migration before creating the first authorized owner account."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Return to Website
        </Link>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  if (!getSupabaseAdminConfig()) return <AdminStatusScreen configured={false} />;

  let admin: Awaited<ReturnType<typeof getCurrentAdmin>> = null;
  let data: Awaited<ReturnType<typeof getAdminDashboardData>> | null = null;
  let loadFailed = false;

  try {
    admin = await getCurrentAdmin();
    if (admin) data = await getAdminDashboardData();
  } catch (error) {
    console.error("Unable to render the admin dashboard", error);
    loadFailed = true;
  }

  if (loadFailed) return <AdminStatusScreen configured />;
  if (!admin || !data) return <AdminLoginForm />;

  return (
    <AdminDashboard
      initialProducts={data.products}
      initialQuotes={data.quotes.filter((lead) => lead.status !== "archived")}
      initialNotifications={data.notifications.filter((lead) => lead.status !== "archived")}
      adminName={admin.displayName}
    />
  );
}
