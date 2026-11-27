# Teknisk SEO i mallen

Kraven kommer från "Teknisk SEO: så gör vi på vakstudio.se + mall för nya projekt". Allt i tabellen är inbyggt. Kolumnen "Kontrollera" är det du gör vid lansering.

| Krav | Så löser mallen det | Kontrollera |
|---|---|---|
| Förrenderad HTML | Alla sidor och delningsbilder genereras vid bygget (`ensureStatic = "navigation"` i layouten) | `npm run build` utan fel |
| Ett värdnamn och HTTPS | `www.<domän>` ger 308 till `<domän>` i `next.config.ts`, HSTS och säkerhetsrubriker satta. HTTP → HTTPS sköter Vercel | På riktiga domänen |
| Äkta 404 | Okända adresser svarar 404 med `noindex` | |
| En metadatafunktion | `pageMetadata()` i `src/lib/seo.ts` på alla sidor | |
| Titel och beskrivning | Titel ≤ 60 tecken med sajtnamnet, beskrivning 140–160 tecken. Testas | `npm test` |
| Canonical | Självrefererande `canonical` mot `domain` | |
| `<html lang>` | `lang="sv"` | |
| Delningsbilder | 1200×630 genererade per sida i sajtens färger, `og:locale` `sv_SE` | Delningsfelsökare efter lansering |
| Ikoner | 512×512 och apple-touch-icon genererade från sajtnamnets första bokstav | |
| Organization | Schema med `@id`, logotyp, e-post och `sameAs` från `organization` | Rich Results Test |
| WebSite, BreadcrumbList | Från samma data som den synliga sidan | |
| Article + Person | `author` → `/#author`, fullständig Person på Om oss, byline med `rel="author"` | |
| FAQPage | Från frågorna i frontmatter och konfigurationen | |
| Produkter | `ItemList`, inte `Product`/`Review`, eftersom vi inte har egna tester | |
| Sitemap | `/sitemap.xml` utan utkast, tomma kategorier och avstängda moduler | Skicka in i Search Console |
| robots.txt | `Allow: /`, sitemap-länk, AI-sökrobotar uttryckligen tillåtna | |
| llms.txt | `/llms.txt` och `/llms-full.txt` från konfiguration och publicerade artiklar | |
| Rubriker | En H1 per sida, MDX börjar på `##`, ankare på rubrikerna | |
| Interna länkar | Alla sidor inom två klick. Testet kontrollerar att länkmål finns | `npm test` |
| Prestanda | Statiska sidor, WebP-bilder via `next/image`, inlinad CSS | PageSpeed Insights på domänen |
| Mobil och tillgänglighet | Hoppa-till-innehåll, landmärken, alt-texter, kontrast | Lighthouse tillgänglighet 100 |
| Statistik utan cookies | Vercel Analytics, laddas bara på Vercel | |
| Search Console och Bing | | Verifiera och skicka in sitemapen |
