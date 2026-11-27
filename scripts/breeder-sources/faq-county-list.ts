/**
 * Parser for a site club litter list published as FAQPage structured data,
 * one question per county (used by Golden retrieverklubbens "Aktuella valpkullar").
 * The page carries the list as FAQPage structured data: one question per
 * county, the answer holding one <p> per litter. Kennel websites only appear
 * as links in the visible HTML, so those are read from there.
 *
 * Phone numbers are read past but never returned.
 */
import { counties, type County } from "@/config/counties";

export type ScrapedKennel = {
  kennel: string;
  owners?: string;
  town: string;
  county: County;
  email?: string;
  url?: string;
  litter: {
    born?: string;
    expected?: string;
    delivery?: string;
    puppies?: number;
    sire?: string;
    dam?: string;
    sireMerits?: Merits;
    damMerits?: Merits;
  };
};

type Merits = { show?: string; hunt?: string; mental: boolean; functionDescribed: boolean };

/** The merit lines between "Far:" and "Mor:" (or after "Mor:"), "Nej" meaning none. */
function parentMerits(lines: string[], from: string, to?: string): Merits | undefined {
  const start = lines.findIndex((l) => l.toLowerCase().startsWith(`${from.toLowerCase()}:`));
  if (start < 0) return undefined;
  const rest = lines.slice(start + 1);
  const stop = to ? rest.findIndex((l) => l.toLowerCase().startsWith(`${to.toLowerCase()}:`)) : -1;
  const own = stop >= 0 ? rest.slice(0, stop) : rest;
  const value = (label: string) => {
    const v = field(own, label);
    return v && !/^nej$/i.test(v) ? v : undefined;
  };
  return {
    show: value("Utställning"),
    hunt: value("Jaktprovsmerit"),
    mental: /^ja/i.test(field(own, "Känd mental status") ?? ""),
    functionDescribed: /^ja/i.test(field(own, "Funktionsbeskriven") ?? ""),
  };
}

const decode = (text: string) =>
  text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&#8217;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

/** "KENNEL SUNNY DELIGHT’S" -> "Kennel Sunny Delight’s". */
export function titleCase(name: string) {
  return name
    .toLowerCase()
    .replace(/(^|[\s\-(])(\p{L})/gu, (_, before: string, letter: string) => before + letter.toUpperCase());
}

/** "C – Uppsala län" -> "Uppsala län"; "O – Västra Götaland" -> "Västra Götalands län". */
function toCounty(heading: string): County | null {
  // Headings carry entity-encoded tags (&lt;strong&gt;), so decode twice.
  const name = decode(decode(heading)).replace(/^[A-ZÅÄÖ]{1,2}\s*[–-]\s*/, "").trim();
  const exact = counties.find((county) => county === name);
  if (exact) return exact;
  const loose = counties.find((county) => county.replace(/s? län$/, "") === name.replace(/s? län$/, ""));
  return loose ?? null;
}

function field(lines: string[], label: string) {
  const line = lines.find((l) => l.toLowerCase().startsWith(`${label.toLowerCase()}:`));
  return line ? line.slice(line.indexOf(":") + 1).trim() || undefined : undefined;
}

const date = (value?: string) => (value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined);

export function parseFaqCountyList(html: string): { kennels: ScrapedKennel[]; problems: string[] } {
  const problems: string[] = [];

  // Kennel name -> website, from links in the visible page.
  const websites = new Map<string, string>();
  for (const [, href, name] of html.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>\s*(KENNEL[^<]*)<\/a>/g)) {
    websites.set(decode(name).trim().toUpperCase(), href);
  }

  const kennels: ScrapedKennel[] = [];
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  for (const block of blocks) {
    let data: { "@type"?: string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] };
    try {
      data = JSON.parse(block);
    } catch {
      continue;
    }
    if (data["@type"] !== "FAQPage" || !data.mainEntity) continue;

    for (const entry of data.mainEntity) {
      const county = toCounty(entry.name);
      const paragraphs = [...entry.acceptedAnswer.text.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
      for (const paragraph of paragraphs) {
        const lines = decode(paragraph)
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (!lines.length || !/^kennel\b/i.test(lines[0])) continue;
        if (!county) {
          problems.push(`Unknown county heading "${decode(decode(entry.name))}" for ${lines[0]}`);
          continue;
        }
        const rawName = lines[0].trim();
        // Second line is "Owner name(s), Town".
        const ownerLine = lines[1] ?? "";
        const comma = ownerLine.lastIndexOf(",");
        const owners = comma > 0 ? ownerLine.slice(0, comma).trim() : undefined;
        const town = (comma > 0 ? ownerLine.slice(comma + 1) : ownerLine).trim();
        if (!town) {
          problems.push(`No town for ${rawName}`);
          continue;
        }
        const puppies = field(lines, "Antal valpar")?.match(/\d+/)?.[0];
        kennels.push({
          kennel: titleCase(rawName),
          owners,
          town,
          county,
          email: field(lines, "E-post"),
          url: websites.get(rawName.toUpperCase()),
          litter: {
            born: date(field(lines, "Födda")),
            expected: date(field(lines, "Beräknas")),
            delivery: date(field(lines, "Leverans")),
            puppies: puppies ? Number(puppies) : undefined,
            sire: field(lines, "Far"),
            dam: field(lines, "Mor"),
            sireMerits: parentMerits(lines, "Far", "Mor"),
            damMerits: parentMerits(lines, "Mor"),
          },
        });
      }
    }
  }
  return { kennels, problems };
}
