import { site } from "@/config/sites";
import { BREEDER_MAP_PATH, breederMap, STATISTICS_PATH, statistics } from "./nav";
import { type Doc, getArticles, getPillar, linksToHiddenDraft } from "./content";
import { absoluteUrl } from "./site";

/** Published articles only (never drafts), newest first. */
export function publishedArticles() {
  return getArticles({ includeDrafts: false });
}

const line = (doc: Doc) => `- [${doc.frontmatter.title}](${absoluteUrl(doc.href)}): ${doc.frontmatter.lead}`;

/** The llms.txt summary (llmstxt.org): what the site is, its sections and its guides. */
export function llmsSummary() {
  const articles = publishedArticles();
  const pillar = getPillar();
  const parts = [
    `# ${site.siteName}`,
    "",
    `> ${site.description}`,
    "",
    "## Om sajten",
    "",
    `- Språk: svenska`,
    `- Ägs och skrivs av: ${site.organization.author} (${site.organization.name})`,
    `- ${site.sourcesStatement}`,
    `- Sajten finansieras med affiliatelänkar: ${absoluteUrl("/affiliate")}`,
    "",
  ];
  if (pillar && !pillar.frontmatter.draft) parts.push(`## ${site.pillar.navLabel}`, "", line(pillar), "");
  for (const category of site.categories) {
    const inCategory = articles.filter((doc) => doc.category === category.slug);
    if (!inCategory.length) continue;
    parts.push(`## ${category.title}`, "", `${category.description} (${absoluteUrl(`/${category.slug}`)})`, "", ...inCategory.map(line), "");
  }
  const topLevel = articles.filter((doc) => doc.category === null && doc.frontmatter.type !== "pillar");
  if (topLevel.length) parts.push("## Fler guider", "", ...topLevel.map(line), "");
  const modules = [
    ...(statistics ? [`- [${statistics.navLabel}](${absoluteUrl(STATISTICS_PATH)}): siffror med källor.`] : []),
    ...(breederMap ? [`- [${breederMap.navLabel}](${absoluteUrl(BREEDER_MAP_PATH)}): ${breederMap.cta.text}`] : []),
  ];
  if (modules.length) parts.push("## Data", "", ...modules, "");
  parts.push(
    "## Mer",
    "",
    `- [Hela texten i ett dokument](${absoluteUrl("/llms-full.txt")})`,
    "",
  );
  return parts.join("\n");
}

/** MDX without components: JSX blocks and self-closing tags are dropped, headings moved down two levels. */
function mdxToMarkdown(body: string) {
  return body
    .replace(/<([A-Z]\w*)[^>]*\/>/g, "")
    .replace(/<([A-Z]\w*)[^>]*>[\s\S]*?<\/\1>/g, "")
    .replace(/^(#{1,4}) /gm, (_, hashes: string) => `${hashes}## `)
    .replace(/\[([^\]]*)\]\((\/[^)]*)\)/g, (_, text: string, path: string) =>
      linksToHiddenDraft(path) ? text : `[${text}](${absoluteUrl(path)})`,
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** llms-full.txt: the summary, then every published article in full. */
export function llmsFull() {
  const pillar = getPillar();
  const docs = [...(pillar && !pillar.frontmatter.draft ? [pillar] : []), ...publishedArticles().filter((d) => d.frontmatter.type !== "pillar")];
  const sections = docs.map((doc) => {
    const faq = doc.frontmatter.faq.map((item) => `**${item.question}**\n${item.answer}`).join("\n\n");
    const sources = doc.frontmatter.sources.map((s) => `- [${s.name}](${s.url})`).join("\n");
    return [
      `## ${doc.frontmatter.title}`,
      "",
      `URL: ${absoluteUrl(doc.href)}`,
      `Publicerad: ${doc.frontmatter.published}${doc.frontmatter.updated ? `, uppdaterad ${doc.frontmatter.updated}` : ""}`,
      "",
      doc.frontmatter.lead,
      "",
      mdxToMarkdown(doc.body),
      ...(faq ? ["", "### Vanliga frågor", "", faq] : []),
      ...(sources ? ["", "### Källor", "", sources] : []),
    ].join("\n");
  });
  return [llmsSummary(), "", ...sections].join("\n\n");
}
