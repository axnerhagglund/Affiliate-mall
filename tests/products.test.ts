import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import matter from "gray-matter";
import { networkHosts, retailers } from "@/config/retailers";
import { affiliateUrl, formatPrice, parseProducts } from "@/lib/products";

const contentRoot = path.join(process.cwd(), "src", "content");
const dataRoot = path.join(process.cwd(), "src", "data");
const sites = fs.readdirSync(contentRoot);

function mdxFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? mdxFiles(full) : entry.name.endsWith(".mdx") ? [full] : [];
  });
}

function productsOf(site: string) {
  const file = path.join(dataRoot, site, "products.json");
  return fs.existsSync(file) ? parseProducts(fs.readFileSync(file, "utf8"), file) : [];
}

test("every products.json is valid", () => {
  for (const site of fs.readdirSync(dataRoot)) productsOf(site);
});

test("every product an article names exists", () => {
  const missing: string[] = [];
  for (const site of sites) {
    const ids = new Set(productsOf(site).map((product) => product.id));
    for (const file of mdxFiles(path.join(contentRoot, site))) {
      const text = fs.readFileSync(file, "utf8");
      const named = [
        ...[...text.matchAll(/<ProductCard\s+id="([^"]+)"/g)].map((m) => m[1]),
        ...[...text.matchAll(/<ProductTable\s+ids=\{\[([^\]]*)\]\}/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])),
      ];
      for (const id of named) if (!ids.has(id)) missing.push(`${path.relative(process.cwd(), file)}: ${id}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("MDX never links to a store or network directly", () => {
  const hosts = [...Object.values(retailers).flatMap((r) => r.hosts), ...networkHosts];
  const hits: string[] = [];
  for (const site of sites) {
    for (const file of mdxFiles(path.join(contentRoot, site))) {
      // `sources` may cite a store's own fact pages (a manufacturer's manual, say); everything else is checked.
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const text = `${JSON.stringify({ ...data, sources: undefined })}\n${content}`;
      for (const host of hosts) if (text.includes(host)) hits.push(`${path.relative(process.cwd(), file)}: ${host}`);
    }
  }
  assert.deepEqual(hits, []);
});

test("affiliate links carry the article slug as sub-id", () => {
  const offer = { retailer: "butik-b", url: "https://example.com/x?a=1", price: 1, priceCheckedAt: "2026-01-01" };
  assert.equal(affiliateUrl(offer, "basta-selen"), "https://example.com/x?a=1&clickref=basta-selen");
});

test("prices read as Swedish kronor", () => {
  assert.equal(formatPrice(649).replace(/\s/g, " "), "649 kr");
  assert.equal(formatPrice(1295).replace(/\s/g, " "), "1 295 kr");
  assert.equal(formatPrice(289.9).replace(/\s/g, " "), "289,90 kr");
});
