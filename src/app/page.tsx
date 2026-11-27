import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Chevron } from "@/components/Chevron";
import { BreederBand, MainCtaBand } from "@/components/CtaBands";
import { Faq } from "@/components/Faq";
import { FeaturedGuides } from "@/components/FeaturedGuides";
import { JsonLd } from "@/components/JsonLd";
import { Kicker } from "@/components/Kicker";
import { site } from "@/config/sites";
import { getArticles, getArticlesInCategory, getVisibleCategories } from "@/lib/content";
import { BREEDER_MAP_PATH, breederMap, headerCta, mainNavItems } from "@/lib/nav";
import { organizationJsonLd, pageMetadata, siteNavigationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/", title: site.hero.title, description: site.description });

/** The hero title with the configured part (the site name) in the accent colour. */
function HeroTitle() {
  const { title, highlight } = site.hero;
  const at = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <span className="text-[var(--accent)]">{highlight}</span>
      {title.slice(at + highlight.length)}
    </>
  );
}

/** The start template. */
export default function Home() {
  const heroSecondary = headerCta();
  const articles = getArticles().filter((doc) => doc.frontmatter.type !== "pillar");
  const featured = articles.filter((doc) => doc.frontmatter.featured).slice(0, 3);
  const latest = articles.slice(0, 6);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {site.hero.image ? (
          <Image src={site.hero.image} alt={site.hero.imageAlt} fill priority sizes="100vw" className="-z-20 object-cover"
            style={{ objectPosition: `${site.hero.imageFocusX ?? 50}% 50%` }} />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-br from-brand-dark via-ink to-ink" />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--accent)]" />
            {site.siteName}
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            <HeroTitle />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">{site.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${site.pillar.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              {site.pillar.navLabel} <Chevron />
            </Link>
            {heroSecondary.href !== `/${site.pillar.slug}` && (
              <Link
                href={heroSecondary.href}
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                {heroSecondary.label}
              </Link>
            )}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Kicker>Börja här</Kicker>
              <h2 id="featured" className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
                Våra bästa guider
              </h2>
            </div>
            <Link href="#latest" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
              Se alla guider <Chevron />
            </Link>
          </div>
          <FeaturedGuides docs={featured} />
        </section>
      )}

      <section aria-labelledby="categories" className="border-y border-line bg-brand-soft/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Kicker>Utforska</Kicker>
          <h2 id="categories" className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
            Allt om {site.topic}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getVisibleCategories().map((category) => {
              const count = getArticlesInCategory(category.slug).length;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-sm transition hover:border-brand hover:shadow-md"
                  >
                    <span className="block font-display text-xl font-semibold text-ink">{category.title}</span>
                    <span className="mt-2 block text-sm text-muted">{category.description}</span>
                    <span className="mt-auto flex items-center justify-between pt-5 text-sm text-muted">
                      {count === 1 ? "1 artikel" : `${count} artiklar`}
                      <Chevron className="size-4 text-brand transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {latest.length > 0 && (
        <section aria-labelledby="latest" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Kicker>Nytt på sajten</Kicker>
          <h2 id="latest" className="mt-2 scroll-mt-24 font-display text-3xl font-semibold text-ink md:text-4xl">
            Senaste artiklarna
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((doc) => (
              <ArticleCard key={doc.href} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {site.faq.length > 0 && (
        <div className="border-t border-line bg-white/60 px-4 py-16 md:py-20">
          <Faq
            items={site.faq}
            kicker="Vanliga frågor"
            heading="Det du undrar över"
            centered
            intro={
              <>
                Fler svar, med mått och källor, finns i{" "}
                <Link href={`/${site.pillar.slug}`} className="font-medium text-brand underline underline-offset-2">
                  {site.pillar.guideName} om {site.topic}
                </Link>
                .
              </>
            }
          />
        </div>
      )}

      <MainCtaBand />
      <BreederBand />

      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(),
          siteNavigationJsonLd([
            ...mainNavItems().map((item) => ({ name: item.label, href: item.href })),
            ...(breederMap ? [{ name: breederMap.navLabel, href: BREEDER_MAP_PATH }] : []),
          ]),
        ]}
      />
    </>
  );
}
