import { iconImage } from "@/lib/icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home screen icon (iOS rounds the corners itself). */
export default function AppleIcon() {
  return iconImage(180, false);
}
