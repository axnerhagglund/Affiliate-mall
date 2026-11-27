import { site, getCategory } from "@/config/sites";
import { getArticle } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const alt = site.siteName;
export const size = ogSize;
export const contentType = "image/png";

// Same params as the page, so every image is rendered at build time.
export { generateStaticParams } from "./page";

/** Share image for articles: the article title under its category. */
export default async function Image({ params }: { params: Promise<{ slug: string; article: string }> }) {
  const { slug, article } = await params;
  const doc = getArticle(slug, article);
  return ogImage({ title: doc?.frontmatter.title ?? site.hero.title, label: getCategory(slug)?.title });
}
