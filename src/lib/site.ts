import { site } from "@/config/sites";

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, site.domain).toString();
}

const dateFormat = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" });

/** "26 november 2026" from "2026-11-26". */
export function formatDate(iso: string) {
  return dateFormat.format(new Date(`${iso}T12:00:00Z`));
}
