import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clearance Furniture",
  description: "Limited-batch institutional furniture clearance offers from Surya Industries.",
  alternates: { canonical: "/clearance" },
};

export default function ClearanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
