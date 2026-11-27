import { iconImage } from "@/lib/icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** PNG favicon (Google Search shows PNG, not SVG); also the logo in structured data. */
export default function Icon() {
  return iconImage(512, true);
}
