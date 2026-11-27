# Affiliateplan för Robotklipparen

Underlag från användarens egen lista över trädgårdsprogram (november 2026). Provision, programstatus och villkor ska kontrolleras i nätverket inför varje ansökan.

## Program att söka

| Butik | Nätverk | Provision enligt listan | Säljer robotgräsklippare? | Prioritet |
|---|---|---|---|---|
| Husqvarna | CJ Affiliate | Från 5 % | Ja, Automower är deras egen produkt | 1 |
| Söderströms | Adtraction | Ej offentlig | Ej bekräftat, kontrollera sortimentet | 2 |
| Outl1 | Adtraction | Ej offentlig | Ej bekräftat, kontrollera sortimentet | 2 |
| Bauhaus | Ej verifierat i Sverige | – | Ja, har en kategori för robotgräsklippare på bauhaus.se | 3, kontrollera om svenskt program finns |
| Hornbach | Ej verifierat | – | Har en köpguide om robotgräsklippare | 3 |
| Granngården | Oklar status | – | Ej kontrollerat | 3 |

Programsidor:

- Husqvarna: https://www.husqvarna.com/se/utforska-och-upptack/pressrum/husqvarna-affiliate-program/ (registrera hos CJ, bekräfta e-post och godkänn villkoren)
- Söderströms: https://adtraction.com/se/annonsor/1954023616
- Outl1: https://adtraction.com/se/annonsor/1728546056

Weibulls, Wexthuset, Cramers Blommor, Hemfint och Bloomling passar växthussajten bättre än den här.

## Checklista

Innan ansökan (se [06-affiliate.md](06-affiliate.md)):

- [ ] Domänen köpt och sajten live.
- [ ] Namn och e-post ifyllda i `organization` och på Om oss och Integritetspolicy, som sedan publiceras.
- [ ] Konto hos Adtraction och CJ Affiliate, med sajten som ny kanal.

Per godkänt program, skicka till Claude:

- [ ] Djuplänkar per produkt, eller kanal-ID, program-ID och en exempellänk.
- [ ] Spårningsdomänen.
- [ ] Om butikens produktbilder får användas.

Claude lägger sedan till butiken i `src/config/retailers.ts`, väljer produkter, kontrollerar priserna i butiken och publicerar köpguiderna.

## Köpguider att fylla

| Köpguide | Status |
|---|---|
| `/kopguider/basta-robotgrasklipparen-utan-kabel` | Utkast |
| `/kopguider/basta-robotgrasklipparen-liten-tradgard` | Utkast |

Fler köpguider när sortimentet hos de godkända butikerna är känt, till exempel för stor tomt, för slänt (AWD) och tillbehör som garage och väggfästen.

## Bra att veta

- Husqvarna är både butik och källa. Deras manualer och supportsidor får stå i `sources`, men länkar i texten till husqvarna.com stoppas av testet så fort Husqvarna läggs in som butik. Produkter visas med `<ProductCard>`.
- Sub-id-parametrar: CJ använder `sid`, Adtraction `epi`, Tradedoubler `epi`. Kontrollera i nätverkets hjälptexter när programmet är godkänt.
