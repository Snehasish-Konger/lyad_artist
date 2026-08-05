import { Resend } from "resend";
import { categoryById } from "@/content/categories";
import type { CommissionInput, QuestionInput } from "./validation";

const STUDIO_EMAIL = process.env.STUDIO_EMAIL ?? "studio@snehasishkonger.com";
const MAIL_FROM = process.env.MAIL_FROM ?? "Studio <onboarding@resend.dev>";

/** Lazily constructed so a missing key is a runtime send error, not a build failure. */
function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export type Attachment = { filename: string; content: Buffer };

type SendResult = { ok: true } | { ok: false; reason: string };

async function send(opts: {
  subject: string;
  replyTo: string;
  html: string;
  text: string;
  attachments?: Attachment[];
}): Promise<SendResult> {
  const resend = client();

  if (!resend) {
    // In local development without a key, log the message instead of pretending
    // it sent. The form still shows its success state so the flow is testable.
    console.warn(
      "\n[email] RESEND_API_KEY is not set — message not sent. Copy .env.example to .env.local to enable.\n" +
        `[email] to: ${STUDIO_EMAIL}\n[email] subject: ${opts.subject}\n\n${opts.text}\n`,
    );
    return { ok: true };
  }

  const { error } = await resend.emails.send({
    from: MAIL_FROM,
    to: [STUDIO_EMAIL],
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    attachments: opts.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });

  if (error) {
    console.error("[email] Resend rejected the message:", error);
    return { ok: false, reason: error.message ?? "Email provider error" };
  }

  return { ok: true };
}

// ── Formatting ──────────────────────────────────────────────────────────────

const shell = (title: string, rows: [string, string][], body?: { label: string; text: string }[]) => {
  const cells = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:10px 20px 10px 0;vertical-align:top;color:#9d9484;font:500 11px/1.6 -apple-system,Segoe UI,sans-serif;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap">${k}</td>
           <td style="padding:10px 0;vertical-align:top;color:#221e19;font:400 15px/1.6 -apple-system,Segoe UI,sans-serif">${escapeHtml(v)}</td>
         </tr>`,
    )
    .join("");

  const blocks = (body ?? [])
    .filter((b) => b.text)
    .map(
      (b) =>
        `<div style="margin-top:28px">
           <p style="margin:0 0 8px;color:#9d9484;font:500 11px/1.6 -apple-system,Segoe UI,sans-serif;letter-spacing:.14em;text-transform:uppercase">${b.label}</p>
           <p style="margin:0;color:#221e19;font:400 16px/1.75 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${escapeHtml(b.text)}</p>
         </div>`,
    )
    .join("");

  return `<div style="background:#f4f1ec;padding:32px 16px">
    <div style="max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #d8cdb8;padding:36px 32px">
      <p style="margin:0 0 6px;color:#96543a;font:500 11px/1.6 -apple-system,Segoe UI,sans-serif;letter-spacing:.2em;text-transform:uppercase">snehasishkonger.com</p>
      <h1 style="margin:0 0 28px;color:#221e19;font:400 26px/1.25 Georgia,serif">${escapeHtml(title)}</h1>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5dccb">${cells}</table>
      ${blocks}
    </div>
  </div>`;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plain(rows: [string, string][], body: [string, string][] = []) {
  return [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    ...body.filter(([, v]) => v).map(([k, v]) => `\n${k}\n${"-".repeat(k.length)}\n${v}`),
  ].join("\n");
}

// ── Public senders ──────────────────────────────────────────────────────────

export function sendCommission(data: CommissionInput, attachments: Attachment[]) {
  const typeLabel =
    data.type === "unsure"
      ? "Not sure yet — wants to talk it through"
      : (categoryById[data.type as keyof typeof categoryById]?.label ?? data.type);

  const rows: [string, string][] = [
    ["Type", typeLabel],
    ["Occasion", data.occasion ?? ""],
    ["Size", data.size ?? ""],
    ["Reference", data.referenceLink ?? ""],
    ["Attachment", attachments.length ? attachments.map((a) => a.filename).join(", ") : "None"],
    ["From", data.name],
    ["Email", data.email],
    ["Instagram", data.instagram ?? ""],
    ["Phone", data.phone ?? ""],
    ["Prefers", data.contactPreference],
  ];

  return send({
    subject: `Commission — ${typeLabel} — ${data.name}`,
    replyTo: data.email,
    html: shell("New commission enquiry", rows, [
      { label: "What they're after", text: data.description },
    ]),
    text: plain(rows, [["What they're after", data.description]]),
    attachments,
  });
}

export function sendQuestion(data: QuestionInput) {
  const rows: [string, string][] = [
    ["From", data.name],
    ["Email", data.email],
  ];

  return send({
    subject: `Question — ${data.name}`,
    replyTo: data.email,
    html: shell("New question", rows, [{ label: "Message", text: data.message }]),
    text: plain(rows, [["Message", data.message]]),
  });
}
