import exempelSite from "./exempel";
import robotklipparenSite from "./robotklipparen";
import testSite from "./test-site";
import type { SiteConfig } from "./types";

export type { SiteConfig, Category, FaqItem, BreederMapModule, StatisticsModule } from "./types";

/**
 * Every site config in this repo. A new site adds its own file here and becomes
 * DEFAULT_SITE. `exempel` (fictional example content) and `test-site` (empty)
 * stay so the tests can prove the shared code works for any site.
 */
const sites: Record<string, SiteConfig> = {
  [exempelSite.slug]: exempelSite,
  [testSite.slug]: testSite,
  [robotklipparenSite.slug]: robotklipparenSite,
};

/** The site this repo deploys when SITE is not set. Change this to your own site's slug. */
const DEFAULT_SITE = robotklipparenSite.slug;

/** Every configured site, for tests that check all of them. */
export const allSites = Object.values(sites);

/** The site this deploy serves: the SITE env variable, or DEFAULT_SITE. */
function resolveSite(): SiteConfig {
  const slug = process.env.SITE ?? DEFAULT_SITE;
  const site = sites[slug];
  if (!site) {
    throw new Error(`Unknown SITE "${slug}". Known: ${Object.keys(sites).join(", ")}`);
  }
  return site;
}

export const site = resolveSite();

export function getCategory(slug: string) {
  return site.categories.find((category) => category.slug === slug);
}
