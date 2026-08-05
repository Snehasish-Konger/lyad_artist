import { z } from "zod";
import { categories } from "@/content/categories";

/**
 * One schema per form, shared by the client (inline errors as you go) and the
 * route handler (the copy that actually matters). Never trust the first one.
 */

const categoryIds = categories.map((c) => c.id) as [string, ...string[]];

export const COMMISSION_TYPES = [...categoryIds, "unsure"] as const;

export const OCCASIONS = [
  "A gift",
  "A memorial",
  "An anniversary or wedding",
  "A birthday",
  "Just for myself",
  "Something else",
] as const;

export const SIZES = ["Small", "Medium", "Large", "Not sure yet"] as const;

export const CONTACT_PREFERENCES = ["Email", "Instagram DM"] as const;

/** Max size of an uploaded reference photo, in bytes. Resend caps attachments
 *  at ~40MB per message; 8MB is generous for a phone photo and keeps the
 *  request quick on a mobile connection. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ACCEPTED_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

const name = z
  .string()
  .trim()
  .min(2, "Please tell me your name")
  .max(80, "That name is longer than this field allows");

const email = z
  .string()
  .trim()
  .min(1, "I need an email to reply to")
  .email("That doesn't look like a valid email");

/** Honeypot. Real people never see this field, so anything in it is a bot. */
const honeypot = z.string().max(0).optional().or(z.literal(""));

export const commissionSchema = z.object({
  type: z.enum(COMMISSION_TYPES, { errorMap: () => ({ message: "Pick one to continue" }) }),
  description: z
    .string()
    .trim()
    .min(15, "A sentence or two, so I know what I'm looking at")
    .max(4000, "That's longer than this box takes — email me the rest"),
  occasion: z.string().trim().max(120).optional().or(z.literal("")),
  size: z.string().trim().max(60).optional().or(z.literal("")),
  referenceLink: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^https?:\/\//i.test(v), {
      message: "Paste the full link, starting with https://",
    }),
  name,
  email,
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  contactPreference: z.enum(CONTACT_PREFERENCES).default("Email"),
  website: honeypot,
});

export const questionSchema = z.object({
  name,
  email,
  message: z
    .string()
    .trim()
    .min(10, "A little more detail so I can answer properly")
    .max(4000, "That's longer than this box takes"),
  website: honeypot,
});

export type CommissionInput = z.infer<typeof commissionSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;

/** Flatten a ZodError into { fieldName: firstMessage } for the form UI. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
