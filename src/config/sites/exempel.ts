import type { SiteConfig } from "./types";

/**
 * The example site: fictional content and made-up products that show every
 * page type and component. Copy this file when you start a new site, then
 * point DEFAULT_SITE in index.ts at the copy. Never deploy the example itself.
 */
const exempelSite: SiteConfig = {
  slug: "exempel",
  topic: "exempelämnet",
  topicShort: "ämnet",
  domain: "https://exempel.example",
  foundedYear: 2026,
  siteName: "Exempelsajten",
  description:
    "Exempelsajten visar hur en guidesajt i mallen ser ut: köpguider, guider med källor, produktkort och jämförelser. Allt innehåll här är påhittat.",
  themeColors: {
    primary: "#2f5d46",
    accent: "#c9912e",
    primaryDark: "#1f3f2f",
    soft: "#eef4ee",
  },
  hero: {
    title: "Allt om exempelämnet – på ett ställe",
    highlight: "exempelämnet",
    lead: "Så här ser startsidan ut i mallen. Byt rubrik, ingress och bild i site-konfigurationen.",
    image: null,
    imageAlt: "",
  },
  pillar: { slug: "om-exempelamnet", navLabel: "Om ämnet", guideName: "guiden" },
  categories: [
    {
      slug: "kopguider",
      title: "Köpguider",
      navLabel: "Köpguider",
      description: "Jämförelser och produkter som passar, med priser som kontrolleras för hand.",
    },
    {
      slug: "guider",
      title: "Guider",
      navLabel: "Guider",
      description: "Fakta och råd med källor, så att du kan välja rätt.",
      disclaimer: true,
    },
  ],
  mainCta: {
    href: "/kopguider",
    kicker: "Funderar du på att köpa?",
    title: "Så väljer du rätt",
    text: "Köpguiderna jämför produkter utifrån det som spelar roll, med priser som kontrolleras för hand.",
    label: "Läs köpguiderna",
  },
  faq: [
    {
      question: "Vad är det här för sajt?",
      answer: "Det är exempelsajten i mallen. Allt innehåll är påhittat och visar hur de olika sidtyperna ser ut.",
    },
    {
      question: "Hur byter jag till min egen nisch?",
      answer: "Kopiera src/config/sites/exempel.ts till en egen fil, fyll i den och följ guiden i docs/.",
    },
  ],
  affiliateDisclosure: "Sidan innehåller annonslänkar. Vi får provision om du handlar via dem, utan extra kostnad för dig.",
  disclaimer: {
    title: "Fråga en expert",
    text: "Texten är allmän information och ersätter inte personlig rådgivning.",
  },
  sourcesStatement: "Fakta bygger på publicerade källor, som anges i varje artikel.",
  organization: { name: "Exempelsajten", author: "Exempel Exempelsson" },
  // Optional modules, made for dog breed sites. See docs/07-moduler.md.
  // modules: {
  //   breederMap: { navLabel: "Hitta uppfödare", cta: { kicker: "Letar du valp?", title: "Hitta en uppfödare nära dig", text: "…", label: "Se uppfödarkartan" } },
  //   statistics: { navLabel: "Statistik" },
  // },
};

export default exempelSite;
