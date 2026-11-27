import { site } from "@/config/sites";
import { getVisibleCategories } from "./content";

/** The optional modules, undefined when a site leaves them out. */
export const breederMap = site.modules?.breederMap;
export const statistics = site.modules?.statistics;

export const BREEDER_MAP_PATH = "/uppfodare";
export const STATISTICS_PATH = "/statistik";

/** The highlighted button in the header. */
export function headerCta() {
  if (site.headerCta) return site.headerCta;
  if (breederMap) return { href: BREEDER_MAP_PATH, label: breederMap.navLabel };
  return { href: site.mainCta.href, label: site.mainCta.label };
}

/** Pillar, visible categories and module pages: the main menu and the SiteNavigationElement list. */
export function mainNavItems() {
  return [
    { href: `/${site.pillar.slug}`, label: site.pillar.navLabel },
    ...getVisibleCategories().map((category) => ({ href: `/${category.slug}`, label: category.navLabel })),
    ...(statistics ? [{ href: STATISTICS_PATH, label: statistics.navLabel }] : []),
  ];
}

/** Module pages that exist on this site, for the sitemap. */
export function modulePaths() {
  return [...(statistics ? [STATISTICS_PATH] : []), ...(breederMap ? [BREEDER_MAP_PATH] : [])];
}
