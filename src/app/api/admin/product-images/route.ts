import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth";
import { isTrustedFormOrigin } from "@/lib/leads/request-security";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 256 * 1024;
const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ACCEPTED_IMAGE_FORMATS = new Set(["jpeg", "png", "webp"]);

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  if (!isTrustedFormOrigin(request)) {
    return response({ error: "The upload origin was not accepted." }, 403);
  }

  const declaredSize = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredSize) && declaredSize > MAX_REQUEST_BYTES) {
    return response({ error: "Choose an image smaller than 10 MB." }, 413);
  }

  try {
    await requireAdmin();
  } catch {
    return response({ error: "Your admin session has expired. Sign in again." }, 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return response({ error: "Choose an image to upload." }, 400);
    }
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      return response({ error: "Use a JPG, PNG, or WebP image." }, 415);
    }
    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return response({ error: "Choose an image between 1 byte and 10 MB." }, 413);
    }

    const input = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(input, {
      failOn: "warning",
      limitInputPixels: 40_000_000,
    }).metadata();

    if (!metadata.format || !ACCEPTED_IMAGE_FORMATS.has(metadata.format)) {
      return response({ error: "The selected file is not a supported image." }, 415);
    }

    const optimized = await sharp(input, {
      failOn: "warning",
      limitInputPixels: 40_000_000,
    })
      .rotate()
      .resize({
        width: 1800,
        height: 1800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    const date = new Date().toISOString().slice(0, 10);
    const storagePath = `catalog/${date}/${randomUUID()}.webp`;
    const supabase = createAdminSupabaseClient();
    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(storagePath, optimized.data, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Product image upload failed", uploadError);
      return response(
        { error: "Image storage is not ready. Apply the latest Supabase migration." },
        503
      );
    }

    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath);
    return response(
      {
        url: data.publicUrl,
        width: optimized.info.width,
        height: optimized.info.height,
        sizeBytes: optimized.data.byteLength,
      },
      201
    );
  } catch (error) {
    console.error("Unable to process product image", error);
    return response({ error: "The image could not be processed. Try another file." }, 400);
  }
}
