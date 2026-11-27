import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { z } from "zod";
import { site, getCategory } from "@/config/sites";

const contentRoot = path.join(process.cwd(), "src", "content", site.slug);

/** Top-level file that holds the pillar guide, served at /<site.pillar.slug>. */
const PILLAR_FILE = "pillar";
/** Folder with the static pages (about, affiliate, privacy). */
const PAGES_DIR = "sidor";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD");

export const frontmatterSchema = z.object({
  /** The H1. The <title> becomes "{title} | {siteName}" unless metaTitle is set. */
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  /** Meta description, 140–160 characters. */
  description: z.string().min(1),
  /** The ingress under the H1, and the excerpt on cards. */
  lead: z.string().min(1),
  /** "info" draws traffic, "kop" has affiliate links, "info-kop" both. */
  type: z.enum(["info", "kop", "info-kop", "pillar", "statisk"]),
  published: isoDate,
  updated: isoDate.optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  /** Shown in "Våra bästa guider" on the home page. */
  featured: z.boolean().default(false),
  /** Drafts render but are noindex and left out of the sitemap and listings. */
  draft: z.boolean().default(false),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  /** Listed under "Källor" at the end of the article. */
  sources: z.array(z.object({ name: z.string(), url: z.url() })).default([]),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type Heading = { id: string; text: string };

export type Doc = {
  /** URL segment of the document itself. */
  slug: string;
  /** Category slug, or null for top-level documents. */
  category: string | null;
  /** Path on the site, e.g. "/<category>/<slug>". */
  href: string;
  frontmatter: Frontmatter;
  /** MDX source without frontmatter. */
  body: string;
  /** The ## headings, with the ids rehype-slug gives them. */
  headings: Heading[];
  wordCount: number;
  /** True when the article shows products, so it needs the affiliate notice. */
  hasProducts: boolean;
};

function readDoc(file: string, slug: string, category: string | null, href: string): Doc {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${path.relative(process.cwd(), file)}: ${parsed.error.message}`);
  }
  const slugger = new GithubSlugger();
  const headings = [...content.matchAll(/^##\s+(.+?)\s*$/gm)].map(([, text]) => ({
    id: slugger.slug(text),
    text,
  }));
  return {
    slug,
    category,
    href,
    frontmatter: parsed.data,
    body: content,
    headings,
    wordCount: content.split(/\s+/).filter(Boolean).length,
    hasProducts: /<Product(Card|Table)\b/.test(content),
  };
}

function mdxFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => ({ file: path.join(dir, name), slug: name.replace(/\.mdx$/, "") }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

let cache: Doc[] | null = null;

/** Every article on the site: the pillar, top-level articles and category articles. */
function loadArticles(): Doc[] {
  if (cache) return cache;
  const docs: Doc[] = [];
  for (const { file, slug } of mdxFiles(contentRoot)) {
    const urlSlug = slug === PILLAR_FILE ? site.pillar.slug : slug;
    docs.push(readDoc(file, urlSlug, null, `/${urlSlug}`));
  }
  for (const category of site.categories) {
    for (const { file, slug } of mdxFiles(path.join(contentRoot, category.slug))) {
      docs.push(readDoc(file, slug, category.slug, `/${category.slug}/${slug}`));
    }
  }
  const unknownDirs = fs.existsSync(contentRoot)
    ? fs
        .readdirSync(contentRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== PAGES_DIR && !getCategory(entry.name))
        .map((entry) => entry.name)
    : [];
  if (unknownDirs.length) {
    throw new Error(`Content folders without a category in the site config: ${unknownDirs.join(", ")}`);
  }
  cache = docs;
  return docs;
}

const newestFirst = (a: Doc, b: Doc) =>
  (b.frontmatter.updated ?? b.frontmatter.published).localeCompare(a.frontmatter.updated ?? a.frontmatter.published);

/**
 * Articles to list. Drafts are listed only when running locally (npm run dev), so
 * they can be reviewed in place; in a production build they are never listed.
 * Drafts are always reachable by URL and always noindex.
 */
export function getArticles({ includeDrafts = process.env.NODE_ENV === "development" } = {}) {
  return loadArticles()
    .filter((doc) => includeDrafts || !doc.frontmatter.draft)
    .sort(newestFirst);
}

export function getArticlesInCategory(category: string) {
  return getArticles().filter((doc) => doc.category === category);
}

/**
 * True when an internal link points at a draft that is not listed in this build.
 * Such links are shown as plain text, and become links again once the draft is published.
 */
export function linksToHiddenDraft(href: string) {
  if (!href.startsWith("/") || process.env.NODE_ENV === "development") return false;
  const path = href.split("#")[0];
  const doc = loadArticles().find((article) => article.href === path);
  return Boolean(doc?.frontmatter.draft);
}

/**
 * Categories with at least one listed article. Empty categories stay out of menus,
 * the home page and the sitemap until they get content (their page is noindex).
 */
export function getVisibleCategories() {
  return site.categories.filter((category) => getArticlesInCategory(category.slug).length > 0);
}

export function getArticle(category: string | null, slug: string) {
  return loadArticles().find((doc) => doc.category === category && doc.slug === slug);
}

export function getPillar() {
  return getArticle(null, site.pillar.slug);
}

/** A static page from src/content/<site>/sidor. */
export function getPage(slug: string) {
  const file = path.join(contentRoot, PAGES_DIR, `${slug}.mdx`);
  return fs.existsSync(file) ? readDoc(file, slug, null, `/${slug}`) : undefined;
}

/**
 * "Du kanske också gillar": first the same category, then the rest, newest first.
 */
export function getRelated(doc: Doc, count = 3) {
  const others = getArticles().filter((other) => other.href !== doc.href && other.frontmatter.type !== "pillar");
  const same = others.filter((other) => other.category === doc.category);
  const rest = others.filter((other) => other.category !== doc.category);
  return [...same, ...rest].slice(0, count);
}

export function lastModified(doc: Doc) {
  return doc.frontmatter.updated ?? doc.frontmatter.published;
}
