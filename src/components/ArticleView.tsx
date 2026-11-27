import Link from "next/link";
import { BREEDER_MAP_PATH, breederMap } from "@/lib/nav";
import { site, getCategory } from "@/config/sites";
import { type Doc, getRelated, lastModified } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { articleJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/site";
import { ArticleCard } from "./ArticleCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Callout } from "./Callout";
import { Cta } from "./Cta";
import { Faq } from "./Faq";
import { JsonLd } from "./JsonLd";
import { Picture } from "./Picture";
import { Toc } from "./Toc";

/** Articles longer than this get a table of contents. */
const TOC_MIN_WORDS = 1500;

/** The article template, shared by category articles, top-level articles and the site guide. */
export async function ArticleView({ doc }: { doc: Doc }) {
  const { frontmatter } = doc;
  const category = doc.category ? getCategory(doc.category) : undefined;
  const crumbs: Crumb[] = [
    ...(category ? [{ name: category.title, href: `/${category.slug}` }] : []),
    { name: frontmatter.title, href: doc.href },
  ];
  const content = await renderMdx(doc.body, { slug: doc.slug, href: doc.href, faq: frontmatter.faq });
  const related = frontmatter.type === "pillar" ? [] : getRelated(doc);
  const modified = lastModified(doc);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-8">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">{frontmatter.title}</h1>
      <p className="mt-4 text-lg text-muted">{frontmatter.lead}</p>
      <Picture src={frontmatter.image} alt={frontmatter.imageAlt ?? ""} priority className="mt-8" />
      <p className="mt-4 text-sm text-muted">
        Publicerad <time dateTime={frontmatter.published}>{formatDate(frontmatter.published)}</time>
        {frontmatter.updated && frontmatter.updated !== frontmatter.published && (
          <>
            {" · "}Uppdaterad <time dateTime={frontmatter.updated}>{formatDate(frontmatter.updated)}</time>
          </>
        )}
        {" · "}Av{" "}
        <Link href="/om-oss" rel="author" className="underline underline-offset-2 hover:text-brand-dark">
          {site.organization.author}
        </Link>
      </p>

      {doc.hasProducts && (
        <p className="mt-6 rounded-lg bg-brand-soft px-4 py-3 text-sm text-ink">
          {site.affiliateDisclosure}{" "}
          <Link href="/affiliate" className="underline">
            Så fungerar annonslänkarna
          </Link>
          .
        </p>
      )}
      {category?.disclaimer && (
        <Callout type="expert">
          <p>{site.disclaimer.text}</p>
        </Callout>
      )}

      {doc.wordCount > TOC_MIN_WORDS && doc.headings.length > 2 && <Toc headings={doc.headings} />}

      <div className="prose mt-8">{content}</div>

      {!doc.body.includes("<FAQ") && <Faq items={frontmatter.faq} />}

      {frontmatter.sources.length > 0 && (
        <section aria-labelledby="sources" className="mt-12 border-t border-line pt-6">
          <h2 id="sources" className="font-display text-xl font-semibold text-ink">
            Källor
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
            {frontmatter.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} className="underline underline-offset-2 hover:text-brand-dark" rel="noopener">
                  {source.name}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-16">
          <h2 id="related" className="font-display text-2xl font-semibold text-ink">
            Du kanske också gillar
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((other) => (
              <ArticleCard key={other.href} doc={other} />
            ))}
          </div>
        </section>
      )}

      {breederMap ? (
        <Cta title={breederMap.cta.title} text={breederMap.cta.text} href={BREEDER_MAP_PATH} label={breederMap.cta.label} />
      ) : (
        <Cta title={site.mainCta.title} text={site.mainCta.text} href={site.mainCta.href} label={site.mainCta.label} />
      )}

      <JsonLd
        data={articleJsonLd({
          path: doc.href,
          headline: frontmatter.title,
          description: frontmatter.description,
          published: frontmatter.published,
          modified,
          image: frontmatter.image,
        })}
      />
    </article>
  );
}
