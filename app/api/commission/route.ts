import { NextResponse } from "next/server";
import { sendCommission, type Attachment } from "@/lib/email";
import { appendToSheet } from "@/lib/sheets";
import { categoryById } from "@/content/categories";
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
    instagramPostReference: value("instagramPostReference"),
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

  const data = parsed.data;
  const categoryLabel =
    data.type === "unsure"
      ? "Not sure yet"
      : (categoryById[data.type as keyof typeof categoryById]?.label ?? data.type);

  // Email is a nice-to-have notification; the Sheet is the permanent record.
  // Both run regardless of the other's outcome so neither failure hides data
  // the other could have captured.
  const [emailResult, sheetResult] = await Promise.all([
    sendCommission(data, attachments),
    appendToSheet({
      Timestamp: new Date().toISOString(),
      Type: "Commission Request",
      Name: data.name,
      Email: data.email,
      "Instagram Handle": data.instagram ?? "",
      Phone: data.phone ?? "",
      Category: categoryLabel,
      Description: data.description,
      "Reference Image Link":
        data.referenceLink || (attachments.length ? "See attachment in email" : ""),
      Occasion: data.occasion ?? "",
      "Preferred Size": data.size ?? "",
      "Preferred Contact Method": data.contactPreference,
      "Instagram Post Reference": data.instagramPostReference ?? "",
      Status: "",
    }),
  ]);

  if (!emailResult.ok) {
    console.error("[commission] email_send_failed:", emailResult.reason);
  }

  // The Sheet is the source of truth — only its success unlocks the success
  // screen. If it failed, the visitor needs to know so nothing gets lost,
  // even if the email notification happened to get through.
  if (!sheetResult.ok) {
    console.error("[commission] sheet_append_failed:", sheetResult.reason);
    return NextResponse.json(
      {
        error:
          "Something went wrong on our end and I can't be sure this was saved — please email studio@snehasishkonger.com directly so nothing gets lost.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
