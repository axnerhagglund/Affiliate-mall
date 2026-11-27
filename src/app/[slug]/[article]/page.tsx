import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { getArticles, getArticle } from "@/lib/content";
import { docMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  const params = getArticles({ includeDrafts: true })
    .filter((doc) => doc.category !== null)
    .map((doc) => ({ slug: doc.category!, article: doc.slug }));
  // Cache Components needs at least one param. A site without articles yet
  // gets one that renders the 404 page, so an empty config still builds.
  return params.length ? params : [{ slug: "_", article: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/[slug]/[article]">): Promise<Metadata> {
  const { slug, article } = await params;
  const doc = getArticle(slug, article);
  return doc ? docMetadata(doc) : {};
}

export default async function Page({ params }: PageProps<"/[slug]/[article]">) {
  const { slug, article } = await params;
  const doc = getArticle(slug, article);
  if (!doc) notFound();
  return <ArticleView doc={doc} />;
}
