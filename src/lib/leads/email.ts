import "server-only";

import { Resend } from "resend";
import { getEmailConfig } from "@/lib/env";
import type { NotifyRequestInput, QuoteRequestInput } from "@/lib/validation/leads";

export interface EmailDeliveryResult {
  status: "sent" | "not_configured" | "failed";
  error: string | null;
}

function emailSubject(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 180);
}

async function sendOwnerEmail(
  subject: string,
  text: string,
  idempotencyKey: string
): Promise<EmailDeliveryResult> {
  const config = getEmailConfig();
  if (!config) return { status: "not_configured", error: null };

  const resend = new Resend(config.apiKey);
  const { error } = await resend.emails.send(
    {
      from: config.from,
      to: [config.to],
      subject,
      text,
    },
    { idempotencyKey }
  );

  if (error) {
    return { status: "failed", error: `${error.name}: ${error.message}`.slice(0, 500) };
  }
  return { status: "sent", error: null };
}

export function sendQuoteEmail(input: QuoteRequestInput, referenceCode: string) {
  const text = [
    `New institutional quote request: ${referenceCode}`,
    "",
    `Organization: ${input.organization}`,
    `Contact: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Location: ${input.location}`,
    `Institution type: ${input.industry}`,
    `Categories: ${input.categories.join(", ")}`,
    `Quantity: ${input.quantity}`,
    `Timeline: ${input.timeline}`,
    `Details: ${input.details || "None supplied"}`,
  ].join("\n");

  return sendOwnerEmail(
    emailSubject(`[${referenceCode}] Quote request from ${input.organization}`),
    text,
    `quote/${input.idempotencyKey}`
  );
}

export function sendNotifyEmail(input: NotifyRequestInput, referenceCode: string) {
  const text = [
    `New restock interest: ${referenceCode}`,
    "",
    `Product: ${input.productTitle}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not supplied"}`,
  ].join("\n");

  return sendOwnerEmail(
    emailSubject(`[${referenceCode}] Restock interest for ${input.productTitle}`),
    text,
    `notify/${input.idempotencyKey}`
  );
}
