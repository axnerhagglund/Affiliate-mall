import type { MetadataRoute } from "next";
import { site } from "@/config/sites";
import { getArticles, getPage, lastModified } from "@/lib/content";
import { modulePaths } from "@/lib/nav";
import { absoluteUrl } from "@/lib/site";

/** Every indexable page. Drafts are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles({ includeDrafts: false });
  const newest = (docs: typeof articles) => (docs[0] ? lastModified(docs[0]) : undefined);
  return [
    { url: absoluteUrl("/"), lastModified: newest(articles) },
    // Only categories with published articles; empty ones are noindex.
    ...site.categories
      .filter((category) => articles.some((doc) => doc.category === category.slug))
      .map((category) => ({
        url: absoluteUrl(`/${category.slug}`),
        lastModified: newest(articles.filter((doc) => doc.category === category.slug)),
      })),
    ...articles.map((doc) => ({ url: absoluteUrl(doc.href), lastModified: lastModified(doc) })),
    ...modulePaths().map((path) => ({ url: absoluteUrl(path) })),
    ...["om-oss", "affiliate", "integritetspolicy"]
      .filter((slug) => getPage(slug)?.frontmatter.draft === false)
      .map((slug) => ({ url: absoluteUrl(`/${slug}`) })),
  ];
}
