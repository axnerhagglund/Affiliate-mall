import type { Metadata } from "next";
import { site } from "@/config/sites";
import { absoluteUrl } from "./site";

/**
 * All metadata and structured data for the site is built here, from the same
 * config and content the pages render. No page writes meta tags by hand.
 */

export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");
export const AUTHOR_ID = absoluteUrl("/#author");

type PageMetadataInput = {
  /** Path on the site, e.g. "/statistik". */
  path: string;
  /** Shown as "{title} | {siteName}" by the root layout's template. */
  title: string;
  description: string;
  type?: "website" | "article";
  published?: string;
  modified?: string;
  /** Own share image; otherwise the nearest opengraph-image file applies. */
  image?: { url: string; alt: string };
  noindex?: boolean;
};

/** The one metadata function every page calls from generateMetadata or metadata. */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
  published,
  modified,
  image,
  noindex,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Only set when needed: a robots key on the page, even undefined, replaces the
    // layout's pre-launch noindex instead of inheriting it.
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      siteName: site.siteName,
      locale: "sv_SE",
      title,
      description,
      url: path,
      ...(type === "article"
        ? { type: "article", publishedTime: published, modifiedTime: modified ?? published, authors: [site.organization.author] }
        : { type: "website" }),
      ...(image ? { images: [{ url: image.url, alt: image.alt }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image.url] } : {}) },
  };
}

/** Defaults for the root layout; every page overrides title and description. */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(site.domain),
    title: { default: site.siteName, template: `%s | ${site.siteName}` },
    description: site.description,
    applicationName: site.siteName,
    // The share image comes from the opengraph-image files (default in src/app).
    openGraph: { siteName: site.siteName, locale: "sv_SE", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

/** The full organization node, printed once on the home page; other pages refer to its @id. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.organization.name,
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon"), width: 512, height: 512 },
    description: site.description,
    areaServed: { "@type": "Country", name: "Sverige" },
    ...(site.organization.email ? { email: site.organization.email } : {}),
    ...(site.organization.sameAs?.length ? { sameAs: site.organization.sameAs } : {}),
    founder: { "@id": AUTHOR_ID },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.siteName,
    url: absoluteUrl("/"),
    inLanguage: "sv-SE",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** The main menu, a signal for sitelinks. */
export function siteNavigationJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}

/** The author, printed in full on the about page; articles refer to its @id. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: site.organization.author,
    url: absoluteUrl("/om-oss"),
    worksFor: { "@id": ORGANIZATION_ID },
  };
}

export function articleJsonLd(input: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.published,
    dateModified: input.modified,
    author: { "@type": "Person", "@id": AUTHOR_ID, name: site.organization.author, url: absoluteUrl("/om-oss") },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: site.organization.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon") },
    },
    mainEntityOfPage: absoluteUrl(input.path),
    image: absoluteUrl(input.image ?? `${input.path}/opengraph-image`),
    inLanguage: "sv-SE",
    isPartOf: { "@id": WEBSITE_ID },
  };
}
