/**
 * Stores this site links to. Replace the examples with the stores whose
 * affiliate programmes you are approved for; the code only builds the links.
 * `subIdParam` is the query parameter the network reads to report which page
 * a sale came from. See docs/06-affiliate.md.
 */
export type Retailer = {
  /** Shown on buttons: "Köp på {name}". */
  name: string;
  network: "adtraction" | "awin" | "addrevenue" | "cj" | "tradedoubler" | "direkt";
  /** Query parameter for the article slug, or null when the network has none. */
  subIdParam: string | null;
  /**
   * Hosts the store's affiliate links and product images use. MDX may never link
   * to them directly (a test checks it); every link goes through products.json.
   */
  hosts: string[];
};

export const retailers: Record<string, Retailer> = {
  // Examples. Check network, sub-id parameter and hosts when a programme is approved.
  "butik-a": { name: "Butik A", network: "adtraction", subIdParam: "epi", hosts: ["butik-a.example"] },
  "butik-b": { name: "Butik B", network: "awin", subIdParam: "clickref", hosts: ["butik-b.example"] },
};

/** Tracking hosts of the networks themselves, which MDX must not link to either. */
export const networkHosts = [
  "track.adtraction.com",
  "awin1.com",
  "addrevenue.io",
  // CJ Affiliate click domains
  "anrdoezrs.net",
  "dpbolvw.net",
  "jdoqocy.com",
  "kqzyfj.com",
  "tkqlhce.com",
  // Tradedoubler
  "clk.tradedoubler.com",
];
