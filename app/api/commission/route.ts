import { NextResponse } from "next/server";
import { sendCommission, type Attachment } from "@/lib/email";
import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  commissionSchema,
  fieldErrors,
} from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Accepts multipart/form-data because of the optional reference photo.
 * Everything is re-validated here — the client-side checks are for feel only.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the form." }, { status: 400 });
  }

  const value = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : "";
  };

  // Honeypot: a bot fills every field it finds, including the hidden one.
  // Answer 200 so it doesn't learn to try again.
  if (value("website")) {
    return NextResponse.json({ ok: true });
  }

  const parsed = commissionSchema.safeParse({
    type: value("type"),
    description: value("description"),
    occasion: value("occasion"),
    size: value("size"),
    referenceLink: value("referenceLink"),
    name: value("name"),
    email: value("email"),
    instagram: value("instagram"),
    phone: value("phone"),
    contactPreference: value("contactPreference") || "Email",
    website: value("website"),
  });

  if (!parsed.success) {
    return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 422 });
  }

  const attachments: Attachment[] = [];
  const file = form.get("reference");

  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { errors: { reference: "That image is over 8MB — try a smaller one." } },
        { status: 422 },
      );
    }
    if (!ACCEPTED_UPLOAD_TYPES.includes(file.type)) {
      return NextResponse.json(
        { errors: { reference: "Images only — JPG, PNG, WEBP or HEIC." } },
        { status: 422 },
      );
    }
    attachments.push({
      filename: file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "reference",
      content: Buffer.from(await file.arrayBuffer()),
    });
  }

  const result = await sendCommission(parsed.data, attachments);

  if (!result.ok) {
    return NextResponse.json(
      { error: "The message didn't go through. Please email studio@snehasishkonger.com directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
