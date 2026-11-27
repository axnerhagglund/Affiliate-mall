import Link from "next/link";
import { STATISTICS_PATH, statistics } from "@/lib/nav";
import { site } from "@/config/sites";
import { getArticlesInCategory, getVisibleCategories } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-lg font-semibold text-brand-dark">
            {site.siteName}
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted">{site.description}</p>
        </div>
        <nav aria-labelledby="footer-categories">
          <h2 id="footer-categories" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
            Kategorier
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {getVisibleCategories().map((category) => (
              <li key={category.slug}>
                <Link href={`/${category.slug}`} className="text-muted hover:text-brand-dark">
                  {category.title}
                  <span className="ml-2 text-xs text-muted/70">{getArticlesInCategory(category.slug).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-about">
          <h2 id="footer-about" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
            Om sajten
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/om-oss" className="text-muted hover:text-brand-dark">
                Om oss
              </Link>
            </li>
            {statistics && (
              <li>
                <Link href={STATISTICS_PATH} className="text-muted hover:text-brand-dark">
                  {statistics.navLabel}
                </Link>
              </li>
            )}
            <li>
              <Link href="/integritetspolicy" className="text-muted hover:text-brand-dark">
                Integritetspolicy
              </Link>
            </li>
            <li>
              <Link href="/affiliate" className="text-muted hover:text-brand-dark">
                Affiliate-information
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted md:flex-row md:justify-between">
          <p>
            © {site.foundedYear} {site.siteName}. Alla rättigheter förbehållna.
          </p>
          <p>
            {site.affiliateDisclosure}{" "}
            <Link href="/affiliate" className="underline hover:text-brand-dark">
              Så tjänar sajten pengar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
