import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryGrid } from "@/components/gallery-grid";
import { PageHeader } from "@/components/page-header";
import { InstagramFeed } from "@/components/instagram-feed";
import { artworks } from "@/content/artworks";
import { categories, type CategoryId } from "@/content/categories";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Devotional portraits, anime and pop-culture fan art, pen-and-ink likenesses and home decor illustration by Snehasish Konger.",
  alternates: { canonical: "/gallery" },
};

/** /gallery?c=devotional lands with that filter already applied. */
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const initialFilter =
    c && categories.some((cat) => cat.id === c) ? (c as CategoryId) : "all";

  return (
    <>
      <PageHeader
        kicker={`${artworks.length} pieces`}
        title="Everything I've drawn that's worth showing you."
        lede="Four bodies of work that look different but come from the same place — trying to get a face, or a form, to look back at you from the page."
      />

      <div className="shell pb-16">
        <Suspense fallback={<div className="h-96" />}>
          <GalleryGrid initialFilter={initialFilter} />
        </Suspense>
      </div>

      <InstagramFeed limit={6} heading="Order straight from a post" />
    </>
  );
}
