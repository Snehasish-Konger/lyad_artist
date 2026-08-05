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
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !key) return null;

  const auth = new JWT({
    email,
    // Env vars can't hold real newlines — .env files store the key with
    // literal "\n" sequences, which need converting back.
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

export async function appendToSheet(row: SheetRow): Promise<AppendResult> {
  const doc = client();

  if (!doc) {
    console.warn(
      "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY not set — row not logged.\n" +
        `[sheets] would have appended: ${JSON.stringify(row)}`,
    );
    return { ok: false, reason: "Google Sheets is not configured" };
  }

  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await ensureHeaderRow(sheet);
    await sheet.addRow(row as Record<string, string>);
    return { ok: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown Google Sheets error";
    console.error("[sheets] append failed:", reason);
    return { ok: false, reason };
  }
}
