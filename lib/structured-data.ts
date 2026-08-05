import { site } from "@/content/site";

/**
 * schema.org has no distinct "VisualArtist" type — "Person" with a jobTitle
 * is what Google's own structured-data docs recommend for an individual
 * practitioner, so that's what this uses rather than an invalid @type.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.brand,
    jobTitle: "Visual Artist",
    url: site.url,
    image: `${site.url}/artwork/studio-portrait.webp`,
    sameAs: [site.instagramUrl],
    email: site.email,
    knowsAbout: [
      "Portrait drawing",
      "Devotional art",
      "Pen and ink illustration",
      "Digital illustration",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.brand,
    description: site.positioning,
    image: `${site.url}/artwork/hero-photo.webp`,
    url: site.url,
    email: site.email,
    founder: { "@type": "Person", name: site.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    sameAs: [site.instagramUrl],
    priceRange: "₹₹",
  };
}
