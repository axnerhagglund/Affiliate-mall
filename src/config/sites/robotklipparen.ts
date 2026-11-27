import type { SiteConfig } from "./types";

/**
 * Robotklipparen: guidesajt om robotgräsklippare. Namn och domän är
 * arbetsnamn tills domänen är köpt.
 */
const robotklipparenSite: SiteConfig = {
  slug: "robotklipparen",
  topic: "robotgräsklippare",
  topicShort: "robotklippare",
  domain: "https://robotklipparen.se",
  foundedYear: 2026,
  siteName: "Robotklipparen",
  description:
    "Välj, installera och sköt din robotgräsklippare: gränskabel eller RTK, slänter, vinterförvaring, knivbyte och igelkottar. Råd med källa i varje artikel.",
  themeColors: {
    primary: "#2e6b3a",
    accent: "#b7d63e",
    primaryDark: "#1d4626",
    soft: "#eef6ea",
  },
  hero: {
    title: "Rätt robotgräsklippare för din trädgård",
    highlight: "robotgräsklippare",
    lead: "Kabel eller RTK, hur stor yta, hur brant slänt – och hur du får den att hålla. Vi går igenom det som avgör, med tillverkarnas egna anvisningar som källa.",
    image: null,
    imageAlt: "",
  },
  pillar: { slug: "robotgrasklippare", navLabel: "Guiden", guideName: "guiden" },
  categories: [
    {
      slug: "valja",
      title: "Välja robotgräsklippare",
      navLabel: "Välja",
      description: "Kabel eller kabelfritt, storlek, slänter och passager: det som avgör vilken robot som passar din tomt.",
    },
    {
      slug: "skotsel",
      title: "Installation & skötsel",
      navLabel: "Skötsel",
      description: "Lägg gränskabeln rätt, byt knivar i tid och förvara roboten över vintern.",
      disclaimer: true,
    },
    {
      slug: "sakerhet",
      title: "Säkerhet & stöldskydd",
      navLabel: "Säkerhet",
      description: "Igelkottar, barn och husdjur på gräsmattan, och hur du skyddar roboten mot stöld.",
      disclaimer: true,
    },
    {
      slug: "kopguider",
      title: "Köpguider",
      navLabel: "Köpguider",
      description: "Robotgräsklippare jämförda utifrån specifikationer och omdömen, med priser som kontrolleras för hand.",
    },
  ],
  headerCta: { href: "/robotgrasklippare", label: "Läs guiden" },
  mainCta: {
    href: "/robotgrasklippare",
    kicker: "Funderar du på att köpa?",
    title: "Allt du behöver veta innan du väljer robot",
    text: "Guiden går igenom navigering, yta, lutning, säkerhet och skötsel – så att du vet vad du ska jämföra.",
    label: "Läs guiden",
  },
  faq: [
    {
      question: "Behöver jag gränskabel?",
      answer:
        "Inte längre. Robotar med kabel styrs av en slinga runt gräsmattan, medan kabelfria robotar använder satellitpositionering med korrigering (RTK) eller kamera och virtuella gränser i en app. Vilket som passar beror på tomten, se jämförelsen gränskabel eller utan kabel.",
    },
    {
      question: "Hur stor robot ska jag välja?",
      answer:
        "Välj en modell vars arbetsyta är större än din gräsmatta, särskilt om trädgården har passager, hinder och flera ytor. Kvadratmetersiffran räcker inte ensam.",
    },
    {
      question: "Klarar robotgräsklippare slänter?",
      answer:
        "Det beror på modellen. Lutning anges i procent, och värdet vid gränskabeln är ofta lägre än inne på ytan. Mät din brantaste slänt och jämför med manualen.",
    },
    {
      question: "Är robotgräsklippare farliga för igelkottar?",
      answer:
        "De kan skada igelkottar, som är aktiva på natten. Det viktigaste rådet är att bara klippa dagtid.",
    },
  ],
  affiliateDisclosure: "Sidan innehåller annonslänkar. Vi får provision om du handlar via dem, utan extra kostnad för dig.",
  disclaimer: {
    title: "Följ manualen för din modell",
    text: "Råden är allmänna. Mått, lutningar och skötselintervall skiljer sig mellan modeller – det som står i bruksanvisningen gäller före det som står här.",
  },
  sourcesStatement:
    "Fakta bygger på tillverkarnas bruksanvisningar och supportsidor, publicerad forskning och konsumentinformation, med källa i varje artikel.",
  organization: { name: "Robotklipparen", author: "Redaktionen på Robotklipparen" },
};

export default robotklipparenSite;
