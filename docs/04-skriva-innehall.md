# 4. Skriva innehåll

## Frontmatter

```yaml
---
title: "Vattensvans hos golden – när svansen hänger efter bad och kyla"   # H1
metaTitle: "Vattensvans hos golden retriever"   # valfri, kortare <title>
description: "140–160 tecken som säljer in klicket i Google."
lead: "Ingressen. Svarar på rubrikens fråga direkt."
image: "/images/<sajt>/torkning-brygga.webp"     # valfri
imageAlt: "Beskrivning av bilden"
type: info            # pillar | info | kop | info-kop | statisk
published: "2026-11-27"
updated: "2026-12-10" # valfri
featured: true        # valfri: visas under "Våra bästa guider"
draft: false          # true = syns bara lokalt
faq:
  - question: "Fråga?"
    answer: "Svar."
sources:
  - name: "Källans namn"
    url: "https://…"
---
```

Testerna kräver på publicerade sidor: `description` 140–160 tecken, `<title>` högst 60 tecken inklusive " | " + sajtnamnet, ingen `TODO-VERIFIERA` och ingen `<Placeholder>`.

## Regler

- **Ingen påhittad fakta.** Varje siffra och påstående ska gå att belägga med en källa i `sources`. Saknas källa: skriv inte påståendet, eller markera `TODO-VERIFIERA` och låt artikeln vara utkast.
- **Svaret först.** Ingressen ger svaret, resten förklarar.
- **Rubriker börjar på `##`.** Innehållsförteckning visas automatiskt i långa artiklar.
- **Interna länkar** med relativa sökvägar. Testet kontrollerar att målet finns.
- **Inga direktlänkar till butiker** i MDX. Testet stoppar dem.
- **Utkast** (`draft: true`) syns med `npm run dev`, märks `noindex` i produktion, ligger inte i sitemapen och länkar till dem visas som vanlig text.

## Komponenter i MDX

| Komponent | Användning |
|---|---|
| `<Callout type="tip">…</Callout>` | Tips. Även `warning`, och `expert` med rubriken från `disclaimer.title` |
| `<FAQ />` | Visar frågorna från frontmatter, med FAQPage-schema |
| `<ProductTable ids={["a", "b"]} />` | Jämförelsetabell |
| `<ProductCard id="a" />` | Produktkort med pris, butik och köpknapp |
| `<ProsCons pros={["…"]} cons={["…"]} />` | Styrkor och svagheter |
| `<FeedingTable rows={[…]} source={{ name, url }} />` | Tabell med riktvärden och källa |
| `<Placeholder>…</Placeholder>` | Platshållare, bara i utkast |
| `- [ ] punkt` | Checklista |

Se `src/content/exempel/` för alla komponenter i bruk.

## Statiska sidor

`src/content/<sajt>/sidor/om-oss.mdx`, `affiliate.mdx` och `integritetspolicy.mdx`. Utgå från exemplets texter och anpassa dem efter vad som faktiskt gäller: vem som driver sajten, vilka källor ni använder och vilka tjänster sajten använder. Om oss länkas bara från sidfoten.
