import { site } from "@/config/sites";
import { ogImage, ogSize } from "@/lib/og";

export const alt = site.siteName;
export const size = ogSize;
export const contentType = "image/png";

/** Default share image for every page without its own. */
export default function Image() {
  return ogImage({ title: site.hero.title });
}
