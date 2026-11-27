@AGENTS.md

# Instruktioner för Claude

Det här är en sajt byggd från Affiliate-mallen. Läs `README.md` och `docs/00-oversikt.md` först.

## Fakta

- Hitta aldrig på fakta, siffror, priser, produkter eller citat. Varje faktauppgift ska ha en källa i artikelns `sources`.
- Det du inte kan belägga markeras `TODO-VERIFIERA: <vad som saknas>` och artikeln förblir `draft: true`. Testerna stoppar `TODO-VERIFIERA` och `<Placeholder>` på publicerade sidor.
- Skriv aldrig att en produkt är testad om ingen har testat den. Skriv "vi har jämfört specifikationer och omdömen" när det är det som gjorts.
- Priser skrivs bara in efter en faktisk kontroll i butiken, med `priceCheckedAt`.

## Innehåll

- Svenska, rakt och konkret. Ingressen (`lead`) svarar på rubrikens fråga direkt.
- `description` 140–160 tecken. `<title>` = `metaTitle ?? title` + " | " + `siteName`, högst 60 tecken.
- MDX börjar på `##`. En H1 per sida, den kommer från `title`.
- Länka internt med relativa sökvägar (`/kategori/slug`). Testet kontrollerar att målet finns.
- Länka aldrig direkt till butiker i MDX. Produkter läggs i `src/data/<sajt>/products.json` och visas med `<ProductCard id="…" />` eller `<ProductTable ids={[…]} />`.
- Delad kod (`src/app`, `src/components`, `src/lib`) får aldrig nämna nischen. Allt nischspecifikt ligger i `src/config/sites/<sajt>.ts` och i innehållet.

## Bilder

- Bilder ska vara realistiska och stämma med texten (rätt färger, miljö, proportioner). Säg till om en bild visar något som är fel.
- Konvertera med `npm run bilder -- <mapp> <sajt>` (WebP, max 1920 px, kvalitet 80). Sikta på under 250 KB per bild.
- Varje bild får en beskrivande `imageAlt`.

## Arbetssätt

- Varje ändring på en egen gren med en PR mot `main`. Merga först när användaren säger till.
- Kör `npm test`, `npm run lint` och `npm run build` innan PR.
- Ta skärmbilder (dator och mobil) när utseendet ändras, och skicka dem till användaren.
