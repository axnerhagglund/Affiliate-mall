# Affiliate-mall

Mall för svenska affiliate- och guidesajter. Den bygger på hur goldenretrievers.se är gjord: Next.js med statiska sidor, innehåll i MDX, produkter i JSON, teknisk SEO inbyggd och tester som stoppar vanliga misstag.

Varje ny sajt är ett eget, fristående repo som skapas från mallen. Mallen innehåller en påhittad **exempelsajt** som visar alla sidtyper och komponenter.

## Ny sajt, i korthet

1. **Use this template → Create a new repository** på GitHub.
2. Kopiera `src/config/sites/exempel.ts` till `src/config/sites/<din-sajt>.ts`, fyll i den och sätt `DEFAULT_SITE` i `src/config/sites/index.ts`.
3. Skapa `src/content/<din-sajt>/` och `src/data/<din-sajt>/` och skriv innehållet.
4. Deploya på Vercel och koppla domänen.

Hela vägen, steg för steg: **[docs/00-oversikt.md](docs/00-oversikt.md)**.

## Kom igång lokalt

```bash
npm ci
npm run dev          # http://localhost:3000, visar även utkast
npm test             # innehåll, SEO-gränser, produkter, neutral kod
npm run lint
npm run build        # alla sidor genereras statiskt
npm run bilder -- <mapp> <sajt>   # PNG/JPG → WebP i public/images/<sajt>/
```

`SITE=test-site npm run build` bevisar att en tom sajt utan moduler fungerar.

## Struktur

```
src/config/sites/<sajt>.ts    namn, domän, färger, kategorier, menyer, CTA:er, FAQ, moduler
src/config/sites/index.ts     vilka sajter som finns och DEFAULT_SITE
src/config/retailers.ts       butiker och affiliatenätverk
src/content/<sajt>/
  pillar.mdx                  den stora guiden, på /<pillar.slug>
  <slug>.mdx                  toppnivåartiklar, t.ex. /a-eller-b
  <kategori>/<slug>.mdx       artiklar, /<kategori>/<slug>
  sidor/                      om-oss, affiliate, integritetspolicy
src/data/<sajt>/products.json produkter och erbjudanden
public/images/<sajt>/         bilder i WebP
src/app, src/components, src/lib   delad kod som aldrig nämner en nisch (testas)
docs/                         guiden från start till lansering
```

## Tillvalsmoduler

Uppfödarkarta (`/uppfodare`) och statistik (`/statistik`) är gjorda för hundrassajter och avstängda som standard. Se [docs/07-moduler.md](docs/07-moduler.md).
