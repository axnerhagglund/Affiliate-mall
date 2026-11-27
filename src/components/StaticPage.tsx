import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { docMetadata } from "@/lib/metadata";
import { renderMdx } from "@/lib/mdx";
import { personJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";

/** The static template: about, affiliate, privacy. Text from src/content/<site>/sidor/<slug>.mdx. */
export async function StaticPage({ slug }: { slug: string }) {
  const doc = getPage(slug);
  if (!doc) notFound();
  const content = await renderMdx(doc.body, { slug: doc.slug, href: doc.href, faq: doc.frontmatter.faq });
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <Breadcrumbs items={[{ name: doc.frontmatter.title, href: doc.href }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-ink">{doc.frontmatter.title}</h1>
      <p className="mt-4 text-lg text-muted">{doc.frontmatter.lead}</p>
      <div className="prose mt-8">{content}</div>
      {/* The author is described in full on the about page; articles refer to this @id. */}
      {slug === "om-oss" && <JsonLd data={personJsonLd()} />}
    </div>
  );
}

export function staticPageMetadata(slug: string) {
  const doc = getPage(slug);
  return doc ? docMetadata(doc) : {};
}
