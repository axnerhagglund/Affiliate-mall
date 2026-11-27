import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { site } from "@/config/sites";
import { counties } from "@/config/counties";

const dataRoot = path.join(process.cwd(), "src", "data", site.slug);

function readJson<T>(name: string, schema: z.ZodType<T>, fallback: T): T {
  const file = path.join(dataRoot, name);
  if (!fs.existsSync(file)) return fallback;
  const parsed = schema.safeParse(JSON.parse(fs.readFileSync(file, "utf8")));
  if (!parsed.success) throw new Error(`Invalid ${path.relative(process.cwd(), file)}: ${parsed.error.message}`);
  return parsed.data;
}

const source = z.object({ name: z.string(), url: z.url() });
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD");

export const statsSchema = z
  .object({
    /** Every source the page cites, keyed so rows can refer to them. */
    sources: z.record(z.string(), source),
    /** SKK registrations per year. A missing year is a gap, never an estimate. */
    registrations: z.array(z.object({ year: z.number().int(), count: z.number().int(), source: z.string() })),
    registrationsNote: z.string().optional(),
    /** How the numbers were collected, shown under "Källor och metod". */
    method: z.string().optional(),
    /** Articles that explain the numbers. */
    related: z.array(z.object({ title: z.string(), href: z.string() })).default([]),
    facts: z.array(z.object({ label: z.string(), value: z.string(), source: z.string() })),
    tables: z.array(
      z.object({ title: z.string(), columns: z.array(z.string()), rows: z.array(z.array(z.string())), source: z.string() }),
    ),
  })
  .superRefine((stats, ctx) => {
    const keys = [
      ...stats.registrations.map((row) => row.source),
      ...stats.facts.map((row) => row.source),
      ...stats.tables.map((row) => row.source),
    ];
    for (const key of keys) {
      if (!(key in stats.sources)) ctx.addIssue({ code: "custom", message: `unknown source "${key}"` });
    }
  });

export type Stats = z.infer<typeof statsSchema>;

export function getStats(): Stats {
  return readJson("stats.json", statsSchema, { sources: {}, registrations: [], facts: [], tables: [], related: [] });
}

/** A parent's merits as the site club lists them. "Nej" is stored as undefined. */
const merits = z.object({
  /** Best show result, e.g. "Cert", "R-Cert", "CK". */
  show: z.string().optional(),
  /** Hunting test result, e.g. "3:a". */
  hunt: z.string().optional(),
  /** Has a full behaviour description (MH or BPH). */
  mental: z.boolean().default(false),
  /** Has a retriever function description. */
  functionDescribed: z.boolean().default(false),
});

export type Merits = z.infer<typeof merits>;

export const breederSchema = z.object({
  kennel: z.string().min(1),
  /** Town or locality only, never a street address. */
  town: z.string().min(1),
  county: z.enum(counties),
  /** Coordinates of the town, not of the kennel's address. */
  lat: z.number().min(55).max(70),
  lng: z.number().min(10).max(25),
  /** The kennel's own public website. */
  url: z.url().optional(),
  /** Breeds under SKK's rules (a requirement for most site clubs' puppy referral). */
  skk: z.boolean().default(false),
  /** Short labels such as "Jaktlinje" or "Utställningslinje". */
  tags: z.array(z.string()).default([]),
  /**
   * Personal data: the breeder's name and e-mail. Only fill these in when the
   * kennel has agreed to be shown, or has been told and not objected.
   */
  owners: z.string().optional(),
  email: z.email().optional(),
  /** Written by the kennel or by us; never copied from the kennel's own site. */
  description: z.string().max(400).optional(),
  /** The litter currently listed with the site club, if any. Removed when the club removes it. */
  litter: z
    .object({
      born: isoDate.optional(),
      expected: isoDate.optional(),
      delivery: isoDate.optional(),
      puppies: z.number().int().positive().optional(),
      sire: z.string().optional(),
      dam: z.string().optional(),
      sireMerits: merits.optional(),
      damMerits: merits.optional(),
    })
    .optional(),
  /** Where the kennel was found, and when its details there last changed. */
  source: z.object({ name: z.string(), url: z.url(), lastSeen: isoDate, about: z.string().optional() }).optional(),
  /** On the club's breeder register (removed from the map when the club removes it). */
  inRegister: z.boolean().default(false),
});

export const breedersSchema = z.object({
  /** Up-to-date lists elsewhere, for example the site club's puppy referral. */
  externalLists: z.array(source).default([]),
  /** The site club lists that scripts/scrape-breeders.ts reads. */
  scrape: z
    .object({
      /** The club's breeder register: every kennel shown, with or without a litter. */
      register: z
        .object({
          parser: z.enum(["section-list"]),
          name: z.string(),
          url: z.url(),
          /** One sentence on what it takes to be on the register, shown on the card. */
          about: z.string(),
        })
        .optional(),
      /** The club's current litters: adds the litter and e-mail to the kennel. */
      litters: z.object({ parser: z.enum(["faq-county-list"]), name: z.string(), url: z.url() }).optional(),
    })
    .optional(),
  /** The sources in one phrase for the map's notice, e.g. "the club's register and puppy referral". */
  sourceSummary: z.string().optional(),
  /** Kennels that asked not to be shown. The scraper never adds them again. */
  excluded: z.array(z.string()).default([]),
  kennels: z.array(breederSchema),
});

export type Breeder = z.infer<typeof breederSchema>;
export type Breeders = z.infer<typeof breedersSchema>;

export function getBreeders(): Breeders {
  return readJson("breeders.json", breedersSchema, { externalLists: [], excluded: [], kennels: [] });
}
