/**
 * npm run check-links: requests every affiliate URL in every site's
 * products.json and lists the broken ones. Exits with 1 if any is broken.
 * Run it before publishing and now and then afterwards; stores move products.
 */
import fs from "node:fs";
import path from "node:path";
import { parseProducts } from "@/lib/products";

const dataRoot = path.join(process.cwd(), "src", "data");
const TIMEOUT_MS = 15_000;
const CONCURRENCY = 4;

type Check = { site: string; product: string; retailer: string; url: string };

function collect(): Check[] {
  return fs.readdirSync(dataRoot).flatMap((site) => {
    const file = path.join(dataRoot, site, "products.json");
    if (!fs.existsSync(file)) return [];
    return parseProducts(fs.readFileSync(file, "utf8"), `src/data/${site}/products.json`).flatMap((product) =>
      product.offers.map((offer) => ({ site, product: product.id, retailer: offer.retailer, url: offer.url })),
    );
  });
}

async function status(url: string): Promise<string | null> {
  const attempt = (method: "HEAD" | "GET") =>
    fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "Mozilla/5.0 (compatible; link-check)" },
    });
  try {
    let response = await attempt("HEAD");
    // Many stores refuse HEAD; ask again with GET before calling the link broken.
    if (response.status >= 400) response = await attempt("GET");
    return response.status >= 400 ? `HTTP ${response.status}` : null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

async function main() {
  const checks = collect();
  const skipped = checks.filter((check) => new URL(check.url).hostname.endsWith("example.com"));
  const todo = checks.filter((check) => !skipped.includes(check));
  const broken: (Check & { problem: string })[] = [];
  let next = 0;
  async function worker() {
    while (next < todo.length) {
      const check = todo[next++];
      const problem = await status(check.url);
      if (problem) broken.push({ ...check, problem });
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`Checked ${todo.length} links (skipped ${skipped.length} example.com links).`);
  if (!broken.length) {
    console.log("No broken links.");
    return;
  }
  console.log(`\n${broken.length} broken:`);
  for (const link of broken) console.log(`- ${link.site} / ${link.product} / ${link.retailer}: ${link.problem}\n  ${link.url}`);
  process.exitCode = 1;
}

main();
