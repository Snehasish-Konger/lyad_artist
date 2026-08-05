import { NextResponse } from "next/server";
import { sendQuestion } from "@/lib/email";
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

  const result = await sendQuestion(parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      { error: "The message didn't go through. Please email studio@snehasishkonger.com directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
