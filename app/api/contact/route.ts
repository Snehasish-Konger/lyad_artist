import { NextResponse } from "next/server";
import { sendQuestion } from "@/lib/email";
import { appendToSheet } from "@/lib/sheets";
import { fieldErrors, questionSchema } from "@/lib/validation";

export const runtime = "nodejs";

/** Backs both the "Just have a question" tab and the contact page form. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read the form." }, { status: 400 });
  }

  const parsed = questionSchema.safeParse(body);

  // Honeypot — silently accept and drop.
  if (parsed.success && parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!parsed.success) {
    return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 422 });
  }

  const data = parsed.data;

  const [emailResult, sheetResult] = await Promise.all([
    sendQuestion(data),
    appendToSheet({
      Timestamp: new Date().toISOString(),
      Type: "General Question",
      Name: data.name,
      Email: data.email,
      Description: data.message,
      Status: "",
    }),
  ]);

  if (!emailResult.ok) {
    console.error("[contact] email send failed:", emailResult.reason);
  }

  if (!sheetResult.ok) {
    console.error("[contact] sheet append failed:", sheetResult.reason);
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
