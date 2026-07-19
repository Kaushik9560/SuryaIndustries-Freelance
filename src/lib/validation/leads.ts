import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(10)
  .max(20)
  .regex(/^\+?[0-9\s()-]+$/, "Enter a valid phone number");

const idempotencySchema = z.string().uuid();

export const quoteRequestSchema = z.object({
  categories: z.array(z.string().trim().min(2).max(160)).min(1).max(8),
  industry: z.enum([
    "Education",
    "Corporate",
    "Healthcare",
    "Financial",
    "Government",
    "Commercial",
  ]),
  quantity: z.enum(["1-10", "10-50", "50-100", "100-500", "500+"]),
  timeline: z.enum(["Immediate", "1-3 Months", "3-6 Months", "Planning"]),
  name: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(180),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: phoneSchema,
  location: z.string().trim().min(2).max(180),
  details: z.string().trim().max(3000).optional().default(""),
  sourcePath: z.string().trim().max(300).optional().default("/"),
  idempotencyKey: idempotencySchema,
  website: z.string().max(0).optional().default(""),
});

export const notifyRequestSchema = z.object({
  productId: z.string().trim().min(1).max(160),
  productTitle: z.string().trim().min(2).max(180),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.union([phoneSchema, z.literal("")]).optional().default(""),
  sourcePath: z.string().trim().max(300).optional().default("/"),
  idempotencyKey: idempotencySchema,
  website: z.string().max(0).optional().default(""),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type NotifyRequestInput = z.infer<typeof notifyRequestSchema>;
