# S. Konger Arts — Studio Site

The primary online home for **S. Konger Arts**, the studio and practice of
artist **Snehasish Konger** (`@lyad_artist` on Instagram). This site and
Instagram are the only two places this work lives — there is no separate
storefront domain.
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Resend · Google Sheets.

It is a portfolio and a way to reach you. It deliberately has **no cart, no
checkout and no product pages** — commissions are a conversation that starts
with a form, and buying an existing piece happens by messaging
[@lyad_artist](https://instagram.com/lyad_artist) on Instagram, one tap away
from every piece on the site via its "Order it" button.

---

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The first few page loads in dev are slow because Next optimises each artwork on
demand and these are large files. It only happens once per size; production
builds do this ahead of time.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run images` | Re-process artwork (see below) |
| `npm run typecheck` | TypeScript, no emit |

---

## How a form submission actually works

Both the commission form and the question form (used standalone on `/contact`
and as the "Just have a question" tab on `/commission`) do the same two things
on submit, in this order:

1. **Append a row to a Google Sheet** — the permanent, source-of-truth log of
   every enquiry. You fill in the `Status` column yourself later (New,
   Replied, Commissioned, Closed) as you work through it.
2. **Send you a formatted email via Resend** — a nice-to-have notification on
   top of the Sheet, so you don't have to keep the Sheet open to notice a new
   enquiry.

The visitor only sees a success screen if the **Sheet write succeeds** — email
is secondary, so a Resend hiccup alone won't block anyone or lose their
enquiry. If the Sheet write fails, the error asks them to email
`studio@snehasishkonger.com` directly instead, and the failure is logged
server-side either way so nothing silently disappears.

Without any of the environment variables below, nothing is sent or logged —
the terminal prints what *would* have gone out instead, so you can test the
form flow end to end before setting either service up.

### Email (Resend)

1. Create a free [Resend](https://resend.com) account.
2. Add `snehasishkonger.com` under **Domains** and add the DNS records it gives
   you. (Until that's verified you can send from `onboarding@resend.dev`, but it
   will only deliver to the address you signed up with.)
3. Create an API key.
4. `cp .env.example .env.local` and fill in:

```
RESEND_API_KEY=re_xxxxxxxx
STUDIO_EMAIL=studio@snehasishkonger.com
MAIL_FROM="S. Konger Arts <studio@snehasishkonger.com>"
```

### Google Sheets (the permanent log)

This uses a **service account**, not your own Google login — a service
account is a robot identity that never needs a human to click "allow," which
is what a server-side API route needs. The Sheet itself is already created;
you're just giving a robot identity permission to write to it.

1. Go to the [Google Cloud Console](https://console.cloud.google.com),
   create a project (or use an existing one), and enable the
   **Google Sheets API** under APIs & Services.
2. **IAM & Admin → Service Accounts → Create Service Account.** Any name is
   fine — it doesn't need any project-level role, since access is granted
   directly on the Sheet in the next step.
3. Open the service account you just created → **Keys → Add Key → Create new
   key → JSON.** This downloads a `.json` file — treat it like a password and
   never commit it.
4. Open that file and copy two values into `.env.local`:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
   Keep the quotes and the `\n` sequences literally as they appear in the
   JSON file — the code converts them back into real newlines at runtime.
5. **The one manual step that can't be scripted:** open the
   [Google Sheet](https://docs.google.com/spreadsheets/d/1S4FTFyrOzhGefyIGg2WkYuWrkBQ1kaHMo8J0Ih2k0m0/edit)
   itself, click **Share**, and add the service account's email address
   (the `client_email` from the JSON file) with **Editor** access. Until you
   do this, every append attempt fails with a permissions error — logged to
   the server console, not shown to visitors as anything scarier than the
   generic "please email me directly" fallback.

The header row (`Timestamp | Type | Name | Email | Instagram Handle | Phone |
Category | Description | Reference Image Link | Occasion | Preferred Size |
Preferred Contact Method | Instagram Post Reference | Status`) is created
automatically on the first successful submission if the sheet doesn't already
have one.

Both forms are validated on the client *and* again on the server, and carry a
hidden honeypot field for spam.

---

## Setting up the Instagram feed

The official Instagram Graph API requires a Meta app review, which isn't worth
it for a one-person studio. The site uses [Behold.so](https://behold.so) instead
(free tier, they handle the OAuth).

1. Sign up and connect `@lyad_artist`.
2. Create a feed and copy its ID out of the JSON endpoint URL
   (`https://feeds.behold.so/XXXXXXXX` → the `XXXXXXXX` part).
3. Add to `.env.local`:

```
NEXT_PUBLIC_BEHOLD_FEED_ID=XXXXXXXX
```

The feed is fetched **server-side** and rendered with the site's own styling
rather than dropped in as a widget — so it looks like the rest of the site, not
like an embed. It revalidates hourly.

Until you set that up, the section falls back to recent pieces from your gallery
and says so in small print. Nothing breaks.

**Prefer a script widget?** (SnapWidget, LightWidget, Elfsight.) There's a
`<ScriptEmbedSlot />` component at the bottom of
[`components/instagram-feed.tsx`](components/instagram-feed.tsx) — paste the
provider's markup in there and render it instead of `<InstagramFeed />`.

### "Order from an Instagram post"

Every post in the feed has an **Order this** button that opens the commission
form pre-filled with a line referencing that post's URL. It's a plain query
param (`/commission?ref=<url>`), nothing clever.

As a fallback that doesn't depend on the widget, step 2 of the commission form
has an **Or paste a link** field for anyone who already has a post in mind.

---

## Adding and replacing artwork

Three steps, no code changes:

1. Drop the image into `content/images/`. **The filename becomes the slug** —
   `mandala-iii.png` → slug `mandala-iii`.
2. Run `npm run images`. This writes an optimised `.webp` to `public/artwork/`
   and records dimensions plus a blur placeholder in `content/artwork-manifest.json`.
3. Add an entry to the `artworks` array in
   [`content/artworks.ts`](content/artworks.ts) with that slug.

```ts
{
  slug: "mandala-iii",
  title: "Mandala III",
  category: "home-decor",        // ids live in content/categories.ts
  year: "2026",
  medium: "Ink — Procreate",
  caption: "One sitting, no undo.",   // optional, but this is where the voice is
  featured: true,                      // shows in Selected Works on the home page
  shopUrl: "sold",  // any non-empty string — see below
}
```

- **`shopUrl` present** (any non-empty string) → the lightbox shows **"Order it"**,
  which copies a ready-made message and opens an Instagram DM to
  `@lyad_artist` — not a link to Shopify. See
  [`components/order-on-instagram.tsx`](components/order-on-instagram.tsx) for
  why it works that way (Instagram has no public way to prefill DM text via a
  link, so the honest version is copy-then-open).
- **No `shopUrl`** → it shows "Available as a commission" and links into the
  commission form pre-filled with that category and piece.

The Shop page's four category cards ("Order it") work the same way, with a
message built from the collection name instead of a piece title.

`heroSlug` and `portraitSlug` at the bottom of the same file control the home
page hero and the About page photo.

---

## What is placeholder and needs replacing

The 35 pieces come from your **Best Art collection** folder — that curated set
*is* the gallery. The images are real; everything written *about* them was
inferred from looking at each picture. Specifically:

| File | What to fix |
| --- | --- |
| `content/artworks.ts` | Every **title, year, medium and caption**. Category assignments are my best guess from looking at each piece — check them. |
| `content/about.ts` | The whole bio, the process paragraphs and the facts table. Written in a plausible voice, but it's not your voice yet. |
| `content/shop.ts` | The four category cards' copy and `note` labels (e.g. "From ₹—"). They no longer link to Shopify — see the ordering note below. |
| `content/site.ts` | Handle, email, shop URL and the one-line positioning statement. |

**Photos in place.** `heroSlug` (home hero) points at `hero-photo`, and
`portraitSlug` (the About page's own photo) points at `studio-portrait` —
both real photos of you, already in `content/images/`. The home page's
"About teaser" section — just under Selected Works — deliberately shows a
piece of art (`aboutTeaserSlug`, currently `far-outpost`) instead of a third
repeat of your photo. All three are plain slugs in `content/artworks.ts`;
swap any of them the same way as any other artwork slug.

---

## Layout of the project

```
app/
  page.tsx              Home — hero, selected works, about teaser, feed, CTA
  gallery/              Filterable masonry + lightbox  (/gallery?c=devotional works)
  about/  shop/  contact/
  commission/           The important one
  api/commission/       Multipart (handles the reference photo) → email + sheet
  api/contact/          JSON → email + sheet
  icon.tsx, apple-icon.tsx        Typography favicon (next/og, no image asset)
  opengraph-image.tsx             Per-route social preview images (one pair
  */opengraph-image.tsx           per page, twitter-image.tsx re-exports it)
components/
  ui/                   Form primitives — shadcn's structure, custom styling
  home-hero, selected-works, gallery-grid, lightbox, artwork-tile,
  instagram-feed, commission-form, commission-tabs, question-form, reveal
  order-on-instagram.tsx          "Order it" — copies a message, opens IG DM
  structured-data.tsx             Renders Person/LocalBusiness JSON-LD
content/                Everything you'd want to edit. No JSX in here.
lib/
  validation.ts         Zod schemas shared by client and server
  email.ts              Resend + the email templates
  sheets.ts             Google Sheets append (service account auth)
  seo.ts                Per-page metadata helper (title/description → full Metadata)
  structured-data.ts    Person + LocalBusiness JSON-LD builders
  og-image.tsx          Shared social-preview image renderer (next/og + sharp)
  order-message.ts      Builds the Instagram DM message text
scripts/optimize-images.mjs
```

Design tokens (the paper/ink/clay palette, type scale, the grain layer) are all
at the top of [`app/globals.css`](app/globals.css) as Tailwind v4 `@theme`
variables. There is no `tailwind.config.js` — v4 doesn't need one.

---

## Deploying to Vercel

1. Push to GitHub and import the repo. Framework preset is detected
   automatically. **If the repo root isn't this folder, set the Vercel project's
   Root Directory to `site`.**
2. Add the environment variables from `.env.example` under
   Settings → Environment Variables.
3. Set `NEXT_PUBLIC_SITE_URL` to the real domain — it feeds the canonical URLs,
   `sitemap.xml` and Open Graph tags.

`content/images/` (~28MB of source files, 2400px webp derived from your originals)
is committed so `npm run images` works on a fresh clone. If the repo gets heavy later, move that folder to storage and
commit only `public/artwork/` plus the manifest.

---

## Notes on a couple of decisions

**No dark mode.** A gallery site should commit to one surface. The background is
white (`#fdfcfa`) with about two percent warmth in it — the *paper* quality comes
from the fixed grain layer and the hairline rules, not from a cream fill. That
matters here because so much of the work is graphite on white paper: the drawing's
own background now merges into the page instead of sitting in a coloured box.

**The grain layer has no `mix-blend-mode`.** A fixed full-viewport blend layer
forces the entire page into a single composited layer — it made large images
render visibly soft and cost a lot on mobile. Plain low-opacity noise looks the
same and stays cheap.

**Animation is one component.** Everything entering on scroll uses `Reveal` /
`RevealGroup` in [`components/reveal.tsx`](components/reveal.tsx) — a short rise
and fade, once. It respects `prefers-reduced-motion` and renders as a plain div
when that's set. Keeping it in one place is what stops a site like this drifting
into being busy.
