import type { Metadata } from "next";
import { type Doc, lastModified } from "./content";
import { pageMetadata } from "./seo";

/** Metadata for an article or static page, from its frontmatter. */
export function docMetadata(doc: Doc): Metadata {
  const { frontmatter } = doc;
  const isArticle = frontmatter.type !== "statisk";
  return pageMetadata({
    path: doc.href,
    title: frontmatter.metaTitle ?? frontmatter.title,
    description: frontmatter.description,
    type: isArticle ? "article" : "website",
    published: isArticle ? frontmatter.published : undefined,
    modified: isArticle ? lastModified(doc) : undefined,
    image: frontmatter.image ? { url: frontmatter.image, alt: frontmatter.imageAlt ?? "" } : undefined,
    noindex: frontmatter.draft,
  });
}
