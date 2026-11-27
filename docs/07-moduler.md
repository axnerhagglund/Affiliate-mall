# 7. Tillvalsmoduler

Modulerna är gjorda för hundrassajter och avstängda som standard. Slår du inte på dem finns varken sidorna, menylänkarna eller sitemap-raderna.

## Uppfödarkarta (`/uppfodare`)

En karta och lista över kennlar från en rasklubbs listor, med filter på län och aktuella kullar.

1. Slå på i konfigurationen:

   ```ts
   modules: {
     breederMap: {
       navLabel: "Hitta uppfödare",
       cta: { kicker: "Letar du valp?", title: "Hitta en uppfödare nära dig", text: "…", label: "Se uppfödarkartan" },
     },
   },
   ```

2. Data i `src/data/<sajt>/breeders.json`. Formatet syns i `src/data/exempel/breeders.json` och schemat i `src/lib/data.ts`. Den kan fyllas för hand eller med skrapan.
3. **Skrapan:** `npm run scrape-breeders` läser källorna i `breeders.json` (`scrape.register` och `scrape.litters`) med tolkarna i `scripts/breeder-sources/`. Orter geokodas via Nominatim (OpenStreetMap) och sparas i `src/data/towns.json`. I molnmiljön behövs `NODE_USE_ENV_PROXY=1` och nätverksåtkomst till källorna och `nominatim.openstreetmap.org`.
4. **Veckovis uppdatering:** slå på `schedule` i `.github/workflows/uppfodarkarta.yml` och bocka i "Allow GitHub Actions to create and approve pull requests" under repots Settings → Actions → General. Varje måndag öppnas då en PR med ändringarna.
5. **Integritet:** visa aldrig adress eller telefonnummer, sätt markören på orten och erbjud borttagning. Informera kennlarna innan lansering och beskriv behandlingen i integritetspolicyn.

## Statistik (`/statistik`)

Registreringar per år (diagram), fakta och tabeller med källor.

1. Slå på: `modules: { statistics: { navLabel: "Statistik" } }`.
2. Data i `src/data/<sajt>/stats.json`. Schemat finns i `src/lib/data.ts`. Varje siffra hänvisar till en källa.
3. Sidans texter är skrivna för hundregistreringar hos SKK. Anpassa `src/app/statistik/page.tsx` om statistiken gäller något annat.
