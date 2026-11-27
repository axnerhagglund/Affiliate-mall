/**
 * Converts images (PNG/JPG, e.g. from Runway) to WebP for the site:
 * at most 1920 px wide, quality 80, into public/images/<site>/.
 *
 *   npm run bilder -- <mapp-med-bilder> [site-slug]
 *
 * The file name becomes the WebP name, so name the files first
 * (e.g. hero.png -> hero.webp). Existing files are overwritten.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [input, siteArg] = process.argv.slice(2);
if (!input) {
  console.error("Användning: npm run bilder -- <mapp-med-bilder> [site-slug]");
  process.exit(1);
}
const site = siteArg ?? process.env.SITE ?? "exempel";
const out = path.join(process.cwd(), "public", "images", site);
fs.mkdirSync(out, { recursive: true });

const files = fs.readdirSync(input).filter((name) => /\.(png|jpe?g|webp)$/i.test(name));
for (const name of files) {
  const target = path.join(out, `${path.parse(name).name}.webp`);
  const info = await sharp(path.join(input, name))
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(target);
  console.log(`${name} -> public/images/${site}/${path.basename(target)} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
