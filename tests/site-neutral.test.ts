import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { allSites } from "@/config/sites";

/** Folders whose code is shared by every site and so must never name one. */
const SHARED = ["src/app", "src/components", "src/lib"];

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}

test("shared code names no site", () => {
  const words = allSites.flatMap((b) => [b.topic, b.topicShort, b.slug, b.siteName]).map((w) => w.toLowerCase());
  const hits: string[] = [];
  for (const file of SHARED.flatMap(files)) {
    const text = fs.readFileSync(file, "utf8").toLowerCase();
    for (const word of words) if (text.includes(word)) hits.push(`${file}: "${word}"`);
  }
  assert.deepEqual(hits, []);
});
