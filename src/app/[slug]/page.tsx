import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { CategoryView } from "@/components/CategoryView";
import { site, getCategory } from "@/config/sites";
import { getArticle, getArticles, getArticlesInCategory } from "@/lib/content";
import { docMetadata } from "@/lib/metadata";
import { pageMetadata } from "@/lib/seo";

/**
 * One top-level segment serves three kinds of page: the site guide
 * (/<pillarSlug>), top-level articles (/<slug>) and categories.
 */
export function generateStaticParams() {
  const topLevel = getArticles({ includeDrafts: true }).filter((doc) => doc.category === null);
  return [...topLevel.map((doc) => ({ slug: doc.slug })), ...site.categories.map((category) => ({ slug: category.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) {
    return pageMetadata({
      path: `/${slug}`,
      title: category.title,
      description: category.description,
      // An empty category is not shown anywhere and should not be indexed until it has articles.
      noindex: getArticlesInCategory(slug).length === 0,
    });
  }
  const doc = getArticle(null, slug);
  return doc ? docMetadata(doc) : {};
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) return <CategoryView category={category} />;
  const doc = getArticle(null, slug);
  if (!doc) notFound();
  return <ArticleView doc={doc} />;
}
