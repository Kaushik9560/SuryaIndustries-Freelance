import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { sendNotifyEmail } from "@/lib/leads/email";
import {
  consumeLeadRateLimit,
  hasFilledHoneypot,
  isTrustedFormOrigin,
  readSmallJsonBody,
} from "@/lib/leads/request-security";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { notifyRequestSchema } from "@/lib/validation/leads";

export const runtime = "nodejs";

function referenceCode() {
  return `SIN-${new Date().getUTCFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  if (!isTrustedFormOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Request origin was rejected." }, { status: 403 });
  }

  try {
    const body = await readSmallJsonBody(request);
    if (hasFilledHoneypot(body)) {
      return NextResponse.json({ ok: true, referenceCode: "RECEIVED" }, { status: 201 });
    }

    const parsed = notifyRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email address and phone number." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    const existingRequest = await supabase
      .from("notify_requests")
      .select("reference_code")
      .eq("client_request_id", parsed.data.idempotencyKey)
      .maybeSingle();
    if (existingRequest.error) throw existingRequest.error;
    if (existingRequest.data) {
      return NextResponse.json({
        ok: true,
        referenceCode: existingRequest.data.reference_code,
      });
    }

    if (!(await consumeLeadRateLimit(request, "notification"))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please retry after 15 minutes." },
        { status: 429 }
      );
    }

    const productResult = await supabase
      .from("products")
      .select("id, title")
      .eq("id", parsed.data.productId)
      .eq("is_visible", true)
      .maybeSingle();
    if (productResult.error) throw productResult.error;
    if (!productResult.data) {
      return NextResponse.json({ ok: false, error: "This product is no longer listed." }, { status: 404 });
    }

    const verifiedInput = { ...parsed.data, productTitle: productResult.data.title };
    const code = referenceCode();
    const { data, error } = await supabase
      .from("notify_requests")
      .insert({
        reference_code: code,
        client_request_id: verifiedInput.idempotencyKey,
        product_id: productResult.data.id,
        product_title: productResult.data.title,
        email: verifiedInput.email,
        phone: verifiedInput.phone || null,
        source_path: verifiedInput.sourcePath,
      })
      .select("id, reference_code")
      .single();

    if (error?.code === "23505") {
      const existing = await supabase
        .from("notify_requests")
        .select("reference_code")
        .eq("client_request_id", verifiedInput.idempotencyKey)
        .single();
      if (existing.data) {
        return NextResponse.json({ ok: true, referenceCode: existing.data.reference_code });
      }
    }
    if (error || !data) throw error ?? new Error("Notification request was not persisted");

    const delivery = await sendNotifyEmail(verifiedInput, data.reference_code);
    const { error: deliveryUpdateError } = await supabase
      .from("notify_requests")
      .update({ email_status: delivery.status, email_error: delivery.error })
      .eq("id", data.id);
    if (deliveryUpdateError) {
      console.error("Unable to record notification email status", deliveryUpdateError.message);
    }

    return NextResponse.json(
      { ok: true, referenceCode: data.reference_code },
      { status: 201 }
    );
  } catch (error) {
    console.error("Notification submission failed", error);
    const message = error instanceof Error ? error.message : "";
    if (message === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ ok: false, error: "The request is too large." }, { status: 413 });
    }
    if (message === "UNSUPPORTED_MEDIA_TYPE") {
      return NextResponse.json({ ok: false, error: "JSON is required." }, { status: 415 });
    }
    if (message === "INVALID_JSON") {
      return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    return NextResponse.json(
      { ok: false, error: "We could not log the request right now. Please retry shortly." },
      { status: 503 }
    );
  }
}
