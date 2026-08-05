import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Shared social-preview image for every route. Satori (what ImageResponse
 * runs on) doesn't decode webp, so the source artwork — already optimised to
 * webp in public/artwork/ — gets re-encoded to PNG at request time. That
 * needs Node's fs + sharp, hence `runtime = "nodejs"` on every caller.
 */
export async function renderOgImage({
  kicker,
  title,
  imageSlug,
}: {
  kicker: string;
  title: string;
  imageSlug: string;
}) {
  const imagePath = path.join(process.cwd(), "public", "artwork", `${imageSlug}.webp`);
  const buffer = await readFile(imagePath);
  const pngBuffer = await sharp(buffer).resize(760, 630, { fit: "cover" }).png().toBuffer();
  const dataUri = `data:image/png;base64,${pngBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#fdfcfa",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 440,
            padding: "0 56px",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#96543a", letterSpacing: 2 }}>
            {kicker.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 52,
              lineHeight: 1.15,
              color: "#221e19",
              fontWeight: 600,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 24, color: "#6b6255" }}>
            {site.brand}
          </div>
        </div>
        <img
          src={dataUri}
          width={760}
          height={630}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    ogSize,
  );
}
