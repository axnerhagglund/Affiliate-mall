# 6. Affiliate

## Innan du ansöker

- Sajten ska vara live på sin domän, eftersom butikerna granskar den.
- Sidorna Affiliate och Integritetspolicy ska vara publicerade.

## Nätverk

| Nätverk | Typiskt | Sub-id-parameter |
|---|---|---|
| Adtraction | Många svenska butiker | `epi` |
| Awin | Större internationella butiker | `clickref` |
| Addrevenue | Svenska butiker | Kontrollera i nätverkets hjälptexter |

Har du redan ett konto lägger du till den nya sajten som en ny kanal eller webbplats. Ansök sedan till varje butiks program.

## Butiker i koden

`src/config/retailers.ts`, en rad per butik:

```ts
"butik-a": { name: "Butik A", network: "adtraction", subIdParam: "epi", hosts: ["butik-a.se", "spårningsdomän"] },
```

- `name` visas på knappen: "Köp på Butik A".
- `subIdParam` gör att artikelns slug skickas med, så att du ser vilka sidor som säljer.
- `hosts` är butikens och spårningens domäner. Testet stoppar direktlänkar till dem i MDX, och produktbilder får hämtas därifrån.

## Produkter

`src/data/<sajt>/products.json`:

```json
{
  "id": "exempel-regntacke",
  "name": "Exempel regntäcke, 60 cm",
  "category": "tacke",
  "image": "/images/<sajt>/produkter/exempel-regntacke.webp",
  "imageAlt": "…",
  "shortDescription": "En mening om varför den passar.",
  "bestFor": "Visas i jämförelsetabellen",
  "badge": "Redaktörens val",
  "offers": [
    { "retailer": "butik-a", "url": "https://…djuplänk…", "price": 499, "oldPrice": 599, "priceCheckedAt": "2026-12-01" }
  ]
}
```

- `url` är djuplänken från nätverket (spårningslänk till produktsidan).
- `price` bara från en faktisk kontroll, med datum.
- Bygget stoppar om en artikel använder ett id som inte finns.

## Vad som sker automatiskt

- Köplänkar får `rel="sponsored nofollow noopener"` och öppnas i ny flik.
- Notisen om annonslänkar visas överst på sidor med produkter.
- Billigaste erbjudandet visas först, övriga butiker under.

## Vad Claude behöver från dig per godkänt program

- Djuplänkar per produkt, eller kanal-ID, program-ID och en exempellänk så att Claude kan bygga dem.
- Spårningsdomänen.
- Om butikens produktbilder får användas.
