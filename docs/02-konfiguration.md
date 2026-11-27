# 2. Konfiguration och design

Allt som skiljer sajter åt ligger i `src/config/sites/<sajt>.ts`. Fälten är dokumenterade i `src/config/sites/types.ts`.

## Fälten

| Fält | Vad | Exempel från goldenretrievers.se |
|---|---|---|
| `slug` | Mappnamn för innehåll och data | `golden-retriever` |
| `topic`, `topicShort` | Ämnet i löptext | "golden retriever", "golden" |
| `domain` | Kanonisk adress utan snedstreck | `https://goldenretrievers.se` |
| `siteName` | Sajtens namn, i titlar och logotyp | "Goldenretrievers" |
| `foundedYear` | År i copyrightraden | 2026 |
| `description` | Startsidans metabeskrivning | |
| `themeColors` | Färger, se nedan | |
| `hero` | Startsidans rubrik, markerat ord, ingress och bild | |
| `pillar` | Den stora guidens adress, menynamn och namn i löptext | `golden-retriever`, "Om rasen", "rasguiden" |
| `categories` | Kategorierna i menyn. `disclaimer: true` ger expertrutan överst | "Köpa golden", "Vård & hälsa" |
| `headerCta` | Knappen i sidhuvudet (valfri) | |
| `mainCta` | Det mörka bandet på startsidan och rutan under artiklar | "Allt du behöver veta innan du köper" |
| `faq` | Frågor på startsidan, med FAQPage-schema | |
| `affiliateDisclosure` | Notisen om annonslänkar | |
| `disclaimer` | Expertrutans rubrik och text | "Fråga veterinären" |
| `sourcesStatement` | En rad om källor i llms.txt | |
| `organization` | Namn, författare, e-post, sociala profiler | |
| `modules` | Tillval, se [07-moduler.md](07-moduler.md) | |

## Färger

- `primary`: knappar, länkar och etiketter. Måste ha minst 4,5:1 kontrast mot vitt.
- `primaryDark`: hover och rubriker i artiklar.
- `soft`: ljus ton för kort och rutor.
- `accent`: dekor, bara på mörka ytor och foton. Ofta för ljus för text på vit bakgrund.

Neutrala toner (text, linjer, bakgrund) ligger i `src/app/globals.css` under `@theme`. Diagram och kartor läser samma färger.

goldenretrievers.se använder skogsgrönt `#2f5d46` med guld `#c9912e` som accent.

**Tips:** be Claude bygga 2–3 varianter och skicka skärmbilder innan du väljer (se [prompter.md](prompter.md)).

## Typsnitt

Typsnitten sätts i `src/app/layout.tsx` med `next/font/google`:

```ts
import { Inter, Lora } from "next/font/google";
const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const heading = Lora({ variable: "--font-heading", subsets: ["latin"] });
```

Byt namnen mot andra Google-typsnitt. Rubriktypsnittet behöver en fet vikt (600).

## Kontroll

```bash
npm test && npm run build
```
