/**
 * Parser for a site club's breeder register published as one paragraph per club
 * section: the section name, then for each kennel a link to its website with the
 * kennel name, and "Owner, Town" on the next line (used by Golden retrieverklubbens
 * "Kennelnamn sorterade sektionsvis"). Club sections do not follow county lines,
 * so the county is found from the town, among the counties the section covers.
 */
import type { County } from "@/config/counties";

export type RegisterKennel = {
  kennel: string;
  owners?: string;
  town: string;
  /** Counties the club section covers; the town's county must be one of them. */
  counties: County[];
  url?: string;
};

/** Club section -> counties it covers. Unknown sections are reported, not guessed. */
const SECTION_COUNTIES: Record<string, County[]> = {
  "DALARNA / S GÄVLEBORG": ["Dalarnas län", "Gävleborgs län"],
  "GÖTEBORG / BOHUSLÄN": ["Västra Götalands län", "Hallands län"],
  HALLAND: ["Hallands län"],
  "JÄMTLAND / HÄRJEDALEN": ["Jämtlands län"],
  "MEDELPAD/HÄLSINGLAND": ["Västernorrlands län", "Gävleborgs län"],
  NORRBOTTEN: ["Norrbottens län"],
  NÄRKE: ["Örebro län"],
  "SKARABORG / ÄLVSBORG": ["Västra Götalands län"],
  "SKÅNE / BLEKINGE": ["Skåne län", "Blekinge län"],
  "SMÅLAND/ÖLAND": ["Jönköpings län", "Kronobergs län", "Kalmar län"],
  "STOCKHOLM / GOTLAND": ["Stockholms län", "Gotlands län"],
  UPPSALA: ["Uppsala län"],
  "VÄRMLAND / N DALSLAND": ["Värmlands län", "Västra Götalands län"],
  VÄSTERBOTTEN: ["Västerbottens län"],
  VÄSTMANLAND: ["Västmanlands län"],
  ÅNGERMANLAND: ["Västernorrlands län"],
  "ÖSTERGÖTLAND / SÖDERMANLAND": ["Östergötlands län", "Södermanlands län"],
};

const decodeEntities = (html: string) =>
  html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&#8217;|&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ");

/** Strips tags, decodes entities, then strips again: the page has entity-encoded tags. */
const text = (html: string) =>
  decodeEntities(html.replace(/<[^>]+>/g, ""))
    .replace(/<[^>]*>?/g, "")
    .trim();

/**
 * "832 49 ORRVIKEN. Tfn 063 – 400 33" -> "Orrviken". Phone numbers and postcodes
 * sometimes stand on the town line; they are cut off here and never stored.
 */
function cleanTown(raw: string) {
  const town = raw
    .trim()
    .split(/\b(?:tfn|tel|telefon|mobil)\b/i)[0]
    .replace(/^\d{3}\s?\d{2}\s+/, "")
    .replace(/[.,;\s]+$/, "")
    .trim();
  if (!town || /\d/.test(town) || town.includes("@")) return "";
  return town === town.toUpperCase() ? town.charAt(0) + town.slice(1).toLowerCase() : town;
}

export function parseSectionList(html: string): { kennels: RegisterKennel[]; problems: string[] } {
  const kennels: RegisterKennel[] = [];
  const problems: string[] = [];
  for (const [, body] of html.matchAll(/<p id="[^"]*"[^>]*>([\s\S]*?)<\/p>/g)) {
    const [head, ...entries] = body.split(/<br\s*\/?>\s*<br\s*\/?>/);
    const headLines = head.split(/<br\s*\/?>/);
    const section = text(headLines[0]).toUpperCase().replace(/\s+/g, " ");
    const counties = SECTION_COUNTIES[section];
    if (!counties) {
      problems.push(`Unknown club section "${section}"`);
      continue;
    }
    // The first kennel shares the paragraph's first block with the heading.
    const blocks = [headLines.slice(1).join("<br>"), ...entries];
    for (const block of blocks) {
      const lines = block.split(/<br\s*\/?>/).map(text).filter(Boolean);
      if (!lines.length) continue;
      const href = block.match(/<a[^>]*href="(https?:\/\/[^"]+)"/)?.[1];
      const [name, ownerLine = ""] = lines;
      const comma = ownerLine.lastIndexOf(",");
      const town = comma > 0 ? cleanTown(ownerLine.slice(comma + 1)) : "";
      if (!town) {
        problems.push(`No town for ${name} in ${section}`);
        continue;
      }
      kennels.push({
        kennel: name,
        // Owner names only; anything with a digit or @ (a number or address) is dropped.
        owners: /[\d@]/.test(ownerLine.slice(0, comma)) ? undefined : ownerLine.slice(0, comma).trim() || undefined,
        town,
        counties,
        url: href,
      });
    }
  }
  return { kennels, problems };
}
