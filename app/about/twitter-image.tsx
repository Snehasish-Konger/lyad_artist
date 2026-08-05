import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    kicker: "About",
    title: "Snehasish Konger",
    imageSlug: "studio-portrait",
  });
}
