import type { SiteConfig } from "./types";

/**
 * An empty site with no content and no modules. Building with SITE=test-site
 * proves that no shared code depends on a niche, on content or on a module.
 */
const testSite: SiteConfig = {
  slug: "test-site",
  topic: "testämne",
  topicShort: "testämne",
  domain: "https://test.example",
  foundedYear: 2026,
  siteName: "Testsajten",
  description: "Testsajt utan innehåll.",
  themeColors: { primary: "#2b6cb0", accent: "#63b3ed", primaryDark: "#1a4971", soft: "#ebf4ff" },
  hero: { title: "Testsajten", lead: "Ingress.", image: null, imageAlt: "" },
  pillar: { slug: "om-testamnet", navLabel: "Om ämnet", guideName: "guiden" },
  categories: [{ slug: "kategori", title: "Kategori", navLabel: "Kategori", description: "Beskrivning." }],
  mainCta: { href: "/kategori", kicker: "Etikett", title: "Köpguide", text: "Text.", label: "Läs" },
  faq: [],
  affiliateDisclosure: "Annonslänkar.",
  disclaimer: { title: "Fråga en expert", text: "Texten ersätter inte en expert." },
  sourcesStatement: "Fakta har källa i varje artikel.",
  organization: { name: "Testsajten", author: "Test" },
};

export default testSite;
