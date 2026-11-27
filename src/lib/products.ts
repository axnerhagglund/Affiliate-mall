import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { site } from "@/config/sites";
import { retailers } from "@/config/retailers";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD");

export const offerSchema = z.object({
  /** Key in src/config/retailers.ts, e.g. "vetzoo". */
  retailer: z.string().refine((key) => key in retailers, { message: "unknown retailer (add it to src/config/retailers.ts)" }),
  /** The affiliate link from the network. */
  url: z.url({ protocol: /^https$/ }),
  /** Price in kronor, only from an actual check on priceCheckedAt. */
  price: z.number().positive(),
  oldPrice: z.number().positive().optional(),
  priceCheckedAt: isoDate,
});

export const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "lower-case letters, digits and dashes"),
  name: z.string().min(1),
  /** Free product group for your own sorting, e.g. "bryggare" or "sele". */
  category: z.string().regex(/^[a-z0-9-]+$/, "lower-case letters, digits and dashes"),
  /** A local path under /public, or an image the affiliate programme allows us to use. */
  image: z.string().refine((src) => src.startsWith("/") || src.startsWith("https://"), "local path or https URL"),
  imageAlt: z.string().optional(),
  shortDescription: z.string().min(1),
  /** "Passar för" in the comparison table. */
  bestFor: z.string().optional(),
  /** Short label above the card, e.g. "Redaktörens val", "Bäst i budget". */
  badge: z.string().min(1).max(24).optional(),
  offers: z.array(offerSchema).min(1),
});

export type Product = z.infer<typeof productSchema>;
export type Offer = z.infer<typeof offerSchema>;

export const productsSchema = z.array(productSchema).superRefine((products, ctx) => {
  const seen = new Set<string>();
  for (const [index, product] of products.entries()) {
    if (seen.has(product.id)) ctx.addIssue({ code: "custom", path: [index, "id"], message: `duplicate id "${product.id}"` });
    seen.add(product.id);
  }
});

const productsFile = path.join(process.cwd(), "src", "data", site.slug, "products.json");

/** Parses a products.json text. Throws with every problem listed. */
export function parseProducts(json: string, label: string): Product[] {
  const parsed = productsSchema.safeParse(JSON.parse(json));
  if (!parsed.success) throw new Error(`Invalid ${label}:\n${z.prettifyError(parsed.error)}`);
  return parsed.data;
}

export function loadProducts(): Product[] {
  if (!fs.existsSync(productsFile)) return [];
  return parseProducts(fs.readFileSync(productsFile, "utf8"), `src/data/${site.slug}/products.json`);
}

let cache: Map<string, Product> | null = null;

/** Throws when an article names a product that is not in products.json, so the build fails. */
export function getProduct(id: string): Product {
  cache ??= new Map(loadProducts().map((product) => [product.id, product]));
  const product = cache.get(id);
  if (!product) throw new Error(`Unknown product id "${id}" (not in src/data/${site.slug}/products.json)`);
  return product;
}

/** Offers cheapest first. */
export function sortedOffers(product: Product) {
  return [...product.offers].sort((a, b) => a.price - b.price);
}

/** The affiliate link with the article slug as sub-id, so the network reports which page converts. */
export function affiliateUrl(offer: Offer, articleSlug: string) {
  const param = retailers[offer.retailer].subIdParam;
  if (!param) return offer.url;
  const url = new URL(offer.url);
  url.searchParams.set(param, articleSlug);
  return url.toString();
}

export function retailerName(offer: Offer) {
  return retailers[offer.retailer].name;
}

const wholeKronor = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
const withOre = new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "649 kr", "289,90 kr". */
export function formatPrice(price: number) {
  return `${(Number.isInteger(price) ? wholeKronor : withOre).format(price)} kr`;
}

/** Props every affiliate link gets. */
export const affiliateLinkProps = { rel: "sponsored nofollow noopener", target: "_blank" } as const;
