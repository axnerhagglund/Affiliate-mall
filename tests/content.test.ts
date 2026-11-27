import assert from "node:assert/strict";
import { test } from "node:test";
import { site } from "@/config/sites";
import { getArticles, getPage, getPillar } from "@/lib/content";
import { getStats } from "@/lib/data";
import { modulePaths } from "@/lib/nav";

const articles = getArticles({ includeDrafts: true });
const published = articles.filter((doc) => !doc.frontmatter.draft);

test("all content parses and every URL is unique", () => {
  const hrefs = articles.map((doc) => doc.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  const clash = articles.filter((doc) => doc.category === null && site.categories.some((c) => c.slug === doc.slug));
  assert.deepEqual(clash.map((doc) => doc.href), [], "top-level article slug equals a category slug");
});

test("the site guide exists", { skip: articles.length === 0 }, () => {
  assert.ok(getPillar(), `missing src/content/${site.slug}/pillar.mdx`);
});

test("published pages are ready for Google", () => {
  const docs = [...published, ...["om-oss", "affiliate", "integritetspolicy"].map(getPage)].filter(
    (doc) => doc && !doc.frontmatter.draft,
  );
  for (const doc of docs) {
    const { description, title, metaTitle } = doc!.frontmatter;
    assert.ok(description.length >= 140 && description.length <= 160, `${doc!.href}: description is ${description.length} chars`);
    assert.ok(`${metaTitle ?? title} | ${site.siteName}`.length <= 60, `${doc!.href}: <title> is ${`${metaTitle ?? title} | ${site.siteName}`.length} chars (max 60)`);
    assert.ok(!doc!.body.includes("TODO-VERIFIERA"), `${doc!.href}: TODO-VERIFIERA left on a published page`);
    assert.ok(!doc!.body.includes("<Placeholder"), `${doc!.href}: placeholder left on a published page`);
  }
});

test("internal links in articles point to pages that exist", () => {
  const known = new Set([
    "/",
    ...modulePaths(),
    "/om-oss",
    "/affiliate",
    "/integritetspolicy",
    ...site.categories.map((c) => `/${c.slug}`),
    ...articles.map((doc) => doc.href),
  ]);
  const broken: string[] = [];
  for (const doc of articles) {
    for (const [, href] of doc.body.matchAll(/\]\((\/[^)#\s]*)/g)) {
      if (!known.has(href)) broken.push(`${doc.href} → ${href}`);
    }
  }
  for (const link of getStats().related) {
    if (!known.has(link.href)) broken.push(`/statistik → ${link.href}`);
  }
  assert.deepEqual(broken, []);
});
