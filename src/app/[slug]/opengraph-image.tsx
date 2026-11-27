import { site, getCategory } from "@/config/sites";
import { getArticle } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const alt = site.siteName;
export const size = ogSize;
export const contentType = "image/png";

// Same params as the page, so every image is rendered at build time.
export { generateStaticParams } from "./page";

/** Share image for categories and top-level articles: the page's own title. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) return ogImage({ title: category.title, label: "Kategori" });
  const doc = getArticle(null, slug);
  return ogImage({ title: doc?.frontmatter.title ?? site.hero.title, label: "Guide" });
}
