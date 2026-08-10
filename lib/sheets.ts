import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

/**
 * The permanent log of every enquiry, independent of email. A service
 * account (not a human OAuth login) so a backend route can write to it with
 * no one present to click "allow" — see README for the one-time setup this
 * needs in the Google Cloud console and in the Sheet's own sharing settings.
 */
const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ?? "1S4FTFyrOzhGefyIGg2WkYuWrkBQ1kaHMo8J0Ih2k0m0";

export const SHEET_HEADERS = [
  "Timestamp",
  "Type",
  "Name",
  "Email",
  "Instagram Handle",
  "Phone",
  "Category",
  "Description",
  "Reference Image Link",
  "Occasion",
  "Preferred Size",
  "Preferred Contact Method",
  "Instagram Post Reference",
  "Status",
] as const;

export type SheetRow = Partial<Record<(typeof SHEET_HEADERS)[number], string>>;

type AppendResult = { ok: true } | { ok: false; reason: string };

function client() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
  if (!email || !key) return null;

  const auth = new JWT({
    email,
    // Env vars can't hold real newlines — dashboards that store the key as a
    // single-line value keep it with literal "\n" sequences, which need
    // converting back. A key pasted with real newlines already (Vercel's
    // multi-line env editor) passes through this unchanged.
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return new GoogleSpreadsheet(SHEET_ID, auth);
}

async function ensureHeaderRow(sheet: GoogleSpreadsheetWorksheet) {
  try {
    await sheet.loadHeaderRow();
  } catch {
    await sheet.setHeaderRow([...SHEET_HEADERS]);
  }
}

/** Narrows a Google API error to a specific, actionable reason so it's
 *  diagnosable from Vercel logs without reproducing it locally. */
function diagnose(err: unknown): string {
  const status = (err as { response?: { status?: number }; code?: number })?.response?.status ??
    (err as { code?: number })?.code;
  const message = err instanceof Error ? err.message : String(err);

  if (status === 403 || /permission/i.test(message)) {
    return `Permission denied (403) — the Sheet has not been shared with the service account as an Editor. Raw: ${message}`;
  }
  if (status === 401 || /invalid_grant|invalid signature|error:1e08010c/i.test(message)) {
    return `Auth rejected (401) — GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is malformed (check \\n escaping) or GOOGLE_SERVICE_ACCOUNT_EMAIL doesn't match the key. Raw: ${message}`;
  }
  if (status === 404 || /not found/i.test(message)) {
    return `Sheet not found (404) — GOOGLE_SHEET_ID is wrong or the service account can't see it. Raw: ${message}`;
  }
  return message;
}

export async function appendToSheet(row: SheetRow): Promise<AppendResult> {
  const doc = client();

  if (!doc) {
    const missing = [
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
    ].filter(Boolean);
    console.warn(
      `[sheets] sheet_append_skipped — missing env var(s): ${missing.join(", ")}. Row not logged.\n` +
        `[sheets] would have appended: ${JSON.stringify(row)}`,
    );
    return { ok: false, reason: `Google Sheets is not configured (missing ${missing.join(", ")})` };
  }

  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await ensureHeaderRow(sheet);
    await sheet.addRow(row as Record<string, string>);
    return { ok: true };
  } catch (err) {
    const reason = diagnose(err);
    console.error("[sheets] sheet_append_failed —", reason);
    return { ok: false, reason };
  }
}
