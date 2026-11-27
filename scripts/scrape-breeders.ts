/**
 * npm run scrape-breeders
 *
 * Reads the site club lists named under "scrape" in src/data/<site>/breeders.json
 * and merges them into the kennels, in this order:
 *   1. the breeder register: every listed kennel is shown on the map,
 *   2. the current litters: adds the litter and e-mail; a kennel not on the register
 *      is added from here too.
 * Then:
 *   - a kennel no longer on the litter list loses its litter,
 *   - a kennel the club removed from the register, and with no litter, leaves the map,
 *   - kennels in "excluded" (asked to be removed) are never added,
 *   - fields the lists do not carry (description, own tags) are kept,
 *   - a kennel's date changes only when its details changed, so a week without
 *     news changes no file.
 * Town coordinates come from OpenStreetMap Nominatim and are cached in
 * src/data/towns.json; each town is looked up once, one request per second.
 *
 * With SCRAPE_SUMMARY set, writes a Markdown summary for the weekly pull request.
 */
import fs from "node:fs";
import path from "node:path";
import { site } from "@/config/sites";
import type { County } from "@/config/counties";
import { type Breeder, breedersSchema } from "@/lib/data";
import { parseFaqCountyList, type ScrapedKennel } from "./breeder-sources/faq-county-list";
import { parseSectionList, type RegisterKennel } from "./breeder-sources/section-list";

const breedersFile = path.join(process.cwd(), "src", "data", site.slug, "breeders.json");
const townsFile = path.join(process.cwd(), "src", "data", "towns.json");
const USER_AGENT = "breeder-map/1.0 (static site build script)";

type Place = { lat: number; lng: number; county?: County };
type Towns = Record<string, Place>;

const today = new Date().toISOString().slice(0, 10);
/** "Kennel Sunny Delight’s", "Sunny Delight" and "SUNNY DELIGHTS" all give "sunnydelight". */
const keyOf = (name: string) =>
  name
    .toLowerCase()
    .replace(/^kennel\s+|\s+kennel$/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .replace(/s$/, "");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** Two kennels are the same if everything but the source (and its date) matches. */
const sameExceptSource = (a: Breeder, b: Breeder) =>
  JSON.stringify({ ...a, source: undefined }) === JSON.stringify({ ...b, source: undefined });

async function fetchPage(url: string) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.text();
}

/**
 * The town's coordinates and county, where the county must be one of `counties`
 * (many Swedish town names exist in several counties). Rounded to two decimals,
 * about 1 km, so a marker never points at a house.
 */
async function locate(town: string, counties: County[], towns: Towns): Promise<Place | null> {
  const key = `${town}|${counties.join("/")}`;
  const cached = towns[key];
  if (cached) return { ...cached, county: cached.county ?? (counties.length === 1 ? counties[0] : undefined) };
  const url = new URL("https://nominatim.openstreetmap.org/search");
  const query = counties.length === 1 ? `${town}, ${counties[0]}, Sverige` : `${town}, Sverige`;
  url.search = new URLSearchParams({ q: query, format: "json", limit: "10", countrycodes: "se", addressdetails: "1" }).toString();
  await sleep(1100);
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT, "accept-language": "sv" } });
  if (!response.ok) throw new Error(`Nominatim answered ${response.status} for ${town}`);
  const hits = (await response.json()) as { lat: string; lon: string; address?: { county?: string } }[];
  // Nominatim puts the Swedish län in address.county.
  const hit = hits.find((h) => counties.includes(h.address?.county as County));
  if (!hit) return null;
  towns[key] = {
    lat: Math.round(Number(hit.lat) * 100) / 100,
    lng: Math.round(Number(hit.lon) * 100) / 100,
    county: hit.address!.county as County,
  };
  return towns[key];
}

async function main() {
  const data = breedersSchema.parse(JSON.parse(fs.readFileSync(breedersFile, "utf8")));
  const { register, litters } = data.scrape ?? {};
  if (!register && !litters) {
    console.log(`No "scrape" sources in ${path.relative(process.cwd(), breedersFile)}.`);
    return;
  }

  const towns: Towns = fs.existsSync(townsFile) ? JSON.parse(fs.readFileSync(townsFile, "utf8")) : {};
  const excluded = new Set(data.excluded.map(keyOf));
  const before = new Map(data.kennels.map((kennel) => [keyOf(kennel.kennel), kennel]));
  const next = new Map(before);
  const problems: string[] = [];

  // 1. The register.
  const onRegister = new Set<string>();
  if (register) {
    const parsed = parseSectionList(await fetchPage(register.url));
    problems.push(...parsed.problems);
    if (parsed.kennels.length < 20) {
      throw new Error(`Only ${parsed.kennels.length} kennels on the register; the layout may have changed. Nothing was written.`);
    }
    const unique = new Map<string, RegisterKennel>();
    for (const kennel of parsed.kennels) unique.set(keyOf(kennel.kennel), kennel);
    for (const [key, found] of unique) {
      if (excluded.has(key)) continue;
      const place = await locate(found.town, found.counties, towns);
      if (!place?.county) {
        problems.push(`No coordinates for ${found.town} in ${found.counties.join(" or ")} (${found.kennel})`);
        continue;
      }
      onRegister.add(key);
      const previous = next.get(key);
      next.set(key, {
        ...previous,
        kennel: found.kennel,
        owners: found.owners,
        town: found.town,
        county: place.county,
        lat: place.lat,
        lng: place.lng,
        url: found.url ?? previous?.url,
        skk: true,
        tags: previous?.tags ?? [],
        inRegister: true,
        source: { name: register.name, url: register.url, lastSeen: today, about: register.about },
      });
    }
  }

  // 2. The litters.
  const withLitter = new Set<string>();
  if (litters) {
    const parsed = parseFaqCountyList(await fetchPage(litters.url));
    problems.push(...parsed.problems);
    const unique = new Map<string, ScrapedKennel>();
    for (const kennel of parsed.kennels) unique.set(keyOf(kennel.kennel), kennel);
    for (const [key, found] of unique) {
      if (excluded.has(key)) continue;
      const previous = next.get(key);
      if (previous?.inRegister && onRegister.has(key)) {
        // Known from the register: keep its name, town and owners; add litter and e-mail.
        next.set(key, { ...previous, email: found.email ?? previous.email, url: previous.url ?? found.url, litter: found.litter });
        withLitter.add(key);
        continue;
      }
      const place = await locate(found.town, [found.county], towns);
      if (!place) {
        problems.push(`No coordinates for ${found.town}, ${found.county} (${found.kennel})`);
        continue;
      }
      next.set(key, {
        ...previous,
        kennel: previous?.kennel ?? found.kennel,
        owners: found.owners,
        town: found.town,
        county: found.county,
        lat: place.lat,
        lng: place.lng,
        url: found.url ?? previous?.url,
        skk: true, // the club only refers litters that follow SKK's and the club's rules
        tags: previous?.tags ?? [],
        email: found.email,
        litter: found.litter,
        inRegister: false,
        source: { name: litters.name, url: litters.url, lastSeen: today },
      });
      withLitter.add(key);
    }
  }

  // 3. Litters that left the list, and kennels the club removed from the register.
  const removed: string[] = [];
  const litterRemoved: string[] = [];
  for (const [key, kennel] of next) {
    if (litters && kennel.litter && !withLitter.has(key)) {
      next.set(key, { ...kennel, litter: undefined });
      litterRemoved.push(kennel.kennel);
    }
    if (register && kennel.inRegister && !onRegister.has(key)) {
      if (withLitter.has(key)) next.set(key, { ...next.get(key)!, inRegister: false });
      else {
        next.delete(key);
        removed.push(kennel.kennel);
      }
    }
  }

  // 4. Keep the old date where nothing else changed.
  const added: string[] = [];
  const updated: string[] = [];
  for (const [key, kennel] of next) {
    const previous = before.get(key);
    if (!previous) added.push(kennel.kennel);
    else if (sameExceptSource(previous, kennel)) next.set(key, { ...kennel, source: previous.source });
    else updated.push(kennel.kennel);
  }

  const kennels = [...next.values()].sort((a, b) => a.kennel.localeCompare(b.kennel, "sv"));
  const result = breedersSchema.parse({ ...data, kennels });
  fs.writeFileSync(breedersFile, `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(townsFile, `${JSON.stringify(towns, null, 2)}\n`);

  const list = (items: string[]) => (items.length ? items.join(", ") : "none");
  console.log(`${kennels.length} kennels on the map (${onRegister.size} on the register, ${withLitter.size} with a litter)`);
  console.log(`New (send the information e-mail): ${list(added)}`);
  console.log(`Updated: ${list(updated)}`);
  console.log(`Removed by the club: ${list(removed)}`);
  console.log(`Litter removed: ${list(litterRemoved)}`);
  if (problems.length) console.log(`\nProblems:\n- ${problems.join("\n- ")}`);

  if (process.env.SCRAPE_SUMMARY) {
    const bullets = (items: string[]) => (items.length ? items.map((item) => `- ${item}`).join("\n") : "- Inga");
    fs.writeFileSync(
      process.env.SCRAPE_SUMMARY,
      [
        `Veckokörning av \`npm run scrape-breeders\`: ${kennels.length} kennlar på kartan, ${onRegister.size} från uppfödarlistan och ${withLitter.size} med aktuell kull.`,
        "",
        "## Nya kennlar",
        "Informera dessa enligt `docs/informationsmejl-kennlar.md` inom en månad.",
        "",
        bullets(added),
        "",
        "## Uppdaterade kennlar",
        bullets(updated),
        "",
        "## Borttagna (inte längre i rasklubbens uppfödarlista)",
        bullets(removed),
        "",
        "## Kull borttagen (inte längre i valphänvisningen)",
        bullets(litterRemoved),
        "",
        "## Problem",
        problems.length ? `${bullets(problems)}\n\nEn ort som saknas kan läggas in för hand i \`src/data/towns.json\`.` : "- Inga",
        "",
      ].join("\n"),
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
