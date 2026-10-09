/**
 * Artwork build step.
 *
 *   npm run images
 *
 * Reads every image in  content/images/
 * Writes web-ready webp to public/artwork/
 * Writes dimensions + blur placeholders to content/artwork-manifest.json
 *
 * The filename (minus extension) is the *slug*. That slug is what you
 * reference from content/artworks.ts. To add a new piece:
 *
 *   1. Drop  my-new-piece.png  into content/images/
 *   2. Run   npm run images
 *   3. Add an entry with slug: "my-new-piece" to content/artworks.ts
 *
 * Nothing in app/ or components/ needs to change.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "content", "images");
const OUT_DIR = path.join(ROOT, "public", "artwork");
const MANIFEST = path.join(ROOT, "content", "artwork-manifest.json");

/** Longest edge of the delivered master. next/image resizes down from here. */
const MAX_EDGE = 2000;
const QUALITY = 82;

const IMAGE_RE = /\.(png|jpe?g|webp|avif|tiff?)$/i;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  let entries;
  try {
    entries = (await fs.readdir(SRC_DIR)).filter((f) => IMAGE_RE.test(f)).sort();
  } catch {
    console.error(`No source folder at ${SRC_DIR}. Create it and drop artwork in.`);
    process.exit(1);
  }

  if (entries.length === 0) {
    console.warn("content/images/ is empty — nothing to do.");
    return;
  }

  const manifest = {};

  for (const file of entries) {
    const slug = file.replace(IMAGE_RE, "");
    const srcPath = path.join(SRC_DIR, file);
    const outPath = path.join(OUT_DIR, `${slug}.webp`);

    const pipeline = sharp(srcPath, { limitInputPixels: false }).rotate();
    const meta = await pipeline.metadata();

    const scale = Math.min(1, MAX_EDGE / Math.max(meta.width, meta.height));
    const width = Math.round(meta.width * scale);
    const height = Math.round(meta.height * scale);

    await pipeline
      .clone()
      .resize(width, height, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#fdfcfa" }) // artwork on paper, never on transparent
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath);

    // Tiny blurred stand-in, inlined as a data URL for next/image placeholder="blur"
    const blur = await sharp(srcPath, { limitInputPixels: false })
      .rotate()
      .resize(20, 20, { fit: "inside" })
      .flatten({ background: "#fdfcfa" })
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer();

    // Content hash in the URL, so a replaced image gets a new URL and no
    // cache (browser, CDN, or next/image's optimizer) serves the old one.
    const version = createHash("sha256")
      .update(await fs.readFile(outPath))
      .digest("hex")
      .slice(0, 10);

    manifest[slug] = {
      src: `/artwork/${slug}.webp?v=${version}`,
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };

    const kb = Math.round((await fs.stat(outPath)).size / 1024);
    console.log(`  ${slug.padEnd(32)} ${width}x${height}  ${kb}kb`);
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n${entries.length} images -> public/artwork/ + content/artwork-manifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
