import Link from "next/link";
import { Suspense } from "react";
import { site } from "@/config/sites";
import { getVisibleCategories } from "@/lib/content";
import { headerCta, mainNavItems, statistics, STATISTICS_PATH } from "@/lib/nav";
import { type NavItem, NavLinks, NavLinksFallback } from "./NavLinks";

/** Sticky header with every category in the menu bar; on small screens they sit in a disclosure. */
export function Header() {
  const categories = getVisibleCategories();
  const items: NavItem[] = mainNavItems();
  const cta = headerCta();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl font-semibold text-brand-dark">
          {site.siteName}
        </Link>

        <nav aria-label="Huvudmeny" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <Suspense fallback={<NavLinksFallback items={items} />}>
              <NavLinks items={items} />
            </Suspense>
            <li className="border-l border-line pl-4">
              <Link href={cta.href} className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
                {cta.label}
              </Link>
            </li>
          </ul>
        </nav>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium">
            Meny
          </summary>
          <nav
            aria-label="Huvudmeny"
            className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border border-line bg-white p-3 shadow-lg"
          >
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={`/${site.pillar.slug}`} className="block rounded-md px-3 py-2 font-semibold hover:bg-brand-soft">
                  {site.pillar.navLabel}
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`} className="block rounded-md px-3 py-2 hover:bg-brand-soft">
                    <span className="block font-semibold text-ink">{category.title}</span>
                    <span className="mt-0.5 block text-muted">{category.description}</span>
                  </Link>
                </li>
              ))}
              {statistics && (
                <li>
                  <Link href={STATISTICS_PATH} className="block rounded-md px-3 py-2 font-semibold hover:bg-brand-soft">
                    {statistics.navLabel}
                  </Link>
                </li>
              )}
              <li className="pt-1">
                <Link href={cta.href} className="block rounded-lg bg-brand px-3 py-2 text-center font-semibold text-white">
                  {cta.label}
                </Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
