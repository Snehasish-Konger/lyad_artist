import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * One call per page instead of hand-rolling alternates/openGraph/twitter
 * everywhere. The <title> tag itself still goes through the template in
 * app/layout.tsx — this only needs to compose the full string for
 * openGraph/twitter, which don't inherit that template.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} — ${site.brand}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
