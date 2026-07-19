"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react";
import { loginAdmin, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = { error: "" };

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-custom-xl p-8 shadow-soft-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-accent flex items-center justify-center text-white mb-4 shadow">
            <Lock size={22} />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Owner Admin Portal</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Secure Surya Industries catalog management
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
            />
          </div>

          {state.error && (
            <div
              role="alert"
              className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg"
            >
              <ShieldAlert size={14} className="shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isPending}
            className="w-full mt-2 cursor-pointer"
          >
            {isPending ? "Verifying..." : "Access Admin Panel"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Website
          </Link>
        </div>
      </div>
    </main>
  );
}
