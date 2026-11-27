/**
 * Everything that differs between sites lives in a SiteConfig plus the site's
 * content folder (src/content/<slug>) and data folder (src/data/<slug>).
 * Shared code never names a niche: it reads it from here.
 */
export type Category = {
  /** URL segment, e.g. "kopguider". */
  slug: string;
  /** Shown as the category page H1, on cards and in the footer. */
  title: string;
  /** Short label for the header menu, e.g. "Köpguider". */
  navLabel: string;
  /** One or two sentences: the category page intro and the menu text. */
  description: string;
  /** Articles in this category get the expert disclaimer (for example health or money). */
  disclaimer?: boolean;
};

export type FaqItem = { question: string; answer: string };

type CtaText = { kicker: string; title: string; text: string };

/** Optional: a map of breeders from a breed club's lists, at /uppfodare. Made for dog breed sites. */
export type BreederMapModule = {
  /** Header button and links, e.g. "Hitta uppfödare". */
  navLabel: string;
  /** Band on the home page and box under articles. */
  cta: CtaText & { label: string };
};

/** Optional: registration and health statistics from stats.json, at /statistik. Made for dog breed sites. */
export type StatisticsModule = {
  /** Header and footer link, e.g. "Statistik". */
  navLabel: string;
};

export type SiteConfig = {
  /** Folder name under src/content and src/data, and the value of the SITE env variable. */
  slug: string;
  /** The niche in running text, lower case: "golden retriever", "kaffebryggare". */
  topic: string;
  /** Short form of the topic in running text: "golden", "bryggare". */
  topicShort: string;
  /** Canonical origin without trailing slash, e.g. "https://example.se". */
  domain: string;
  siteName: string;
  /** For the copyright line. A fixed year keeps the pages static (no clock read at render). */
  foundedYear: number;
  /** Default meta description for the home page. */
  description: string;
  themeColors: {
    /** Buttons, links and small labels. Needs 4.5:1 contrast against white. */
    primary: string;
    /** Decorative accent, only on dark backgrounds and photos (kickers, highlights). */
    accent: string;
    /** Darker shade for hover and headings. */
    primaryDark: string;
    /** Light tint for cards and callouts. */
    soft: string;
  };
  hero: {
    title: string;
    /** Part of the title shown in the accent colour, e.g. the topic. */
    highlight?: string;
    lead: string;
    /** Path under /public, or null for the drawn placeholder until an image exists. */
    image: string | null;
    /** Horizontal focus of the hero image in percent (where the subject is), kept in view on narrow screens. */
    imageFocusX?: number;
    imageAlt: string;
  };
  /**
   * The pillar page: the big guide to the topic, from src/content/<slug>/pillar.mdx,
   * served at /<slug>. `navLabel` is its menu item ("Om rasen", "Guide"),
   * `guideName` how running text names it ("rasguiden", "guiden").
   */
  pillar: { slug: string; navLabel: string; guideName: string };
  categories: Category[];
  /** Header button. Defaults to the breeder map when that module is on, else to mainCta. */
  headerCta?: { href: string; label: string };
  /** The dark call to action on the home page. */
  mainCta: CtaText & { href: string; label: string };
  /** Shown on the home page, with FAQPage structured data. */
  faq: FaqItem[];
  /** Short notice at the top of articles with products and in the footer. */
  affiliateDisclosure: string;
  /** Callout at the top of articles in categories with `disclaimer`, e.g. "ersätter inte en veterinär". */
  disclaimer: { title: string; text: string };
  /** One line for llms.txt on where the facts come from, e.g. "Fakta bygger på … med källa i varje artikel." */
  sourcesStatement: string;
  /**
   * Who stands behind the site, for Organization structured data, bylines and contact.
   * `email` is also where listed businesses (e.g. kennels) ask to be removed.
   */
  organization: {
    name: string;
    author: string;
    email?: string;
    /** Profiles that exist (Instagram, Facebook …), canonical URLs only. Used as sameAs. */
    sameAs?: string[];
  };
  /** Optional features. Leave a module out and its page, links and sitemap entry disappear. */
  modules?: {
    breederMap?: BreederMapModule;
    statistics?: StatisticsModule;
  };
};
