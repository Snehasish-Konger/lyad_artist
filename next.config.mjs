/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Artwork lives locally in /public/artwork. The only remote source is the
    // Instagram CDN, used when a Behold.so feed is configured (see components/instagram-feed.tsx).
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
