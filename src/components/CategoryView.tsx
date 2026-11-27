import Link from "next/link";
import type { Category } from "@/config/sites";
import { getArticlesInCategory, getVisibleCategories } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { Chevron } from "./Chevron";
import { Kicker } from "./Kicker";

/** The category template. */
export function CategoryView({ category }: { category: Category }) {
  const articles = getArticlesInCategory(category.slug);
  const others = getVisibleCategories().filter((other) => other.slug !== category.slug);
  return (
    <>
      <section className="border-b border-line bg-brand-soft/60">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <Breadcrumbs items={[{ name: category.title, href: `/${category.slug}` }]} />
          <Kicker className="mt-6">Kategori</Kicker>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{category.description}</p>
          <p className="mt-4 text-sm text-muted">
            {articles.length === 1 ? "1 artikel" : `${articles.length} artiklar`} i kategorin
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((doc) => (
              <ArticleCard key={doc.href} doc={doc} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <p className="text-muted">Här kommer guider snart.</p>
        )}
      </div>

      {others.length > 0 && (
        <nav aria-labelledby="other-categories" className="border-t border-line bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <Kicker>Fortsätt utforska</Kicker>
            <h2 id="other-categories" className="mt-2 font-display text-3xl font-semibold text-ink">
              Andra kategorier
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/${other.slug}`}
                    className="group flex h-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 shadow-sm transition hover:border-brand hover:shadow-md"
                  >
                    <span className="font-display font-semibold text-ink">{other.title}</span>
                    <Chevron className="size-4 shrink-0 text-brand transition group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
