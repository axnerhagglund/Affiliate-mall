import type { ReactNode } from "react";
import { site } from "@/config/sites";

const styles = {
  expert: { label: site.disclaimer.title, className: "border-sky-300 bg-sky-50" },
  tip: { label: "Tips", className: "border-emerald-300 bg-emerald-50" },
  warning: { label: "Varning", className: "border-amber-400 bg-amber-50" },
} as const;

/** <Callout type="expert|tip|warning"> in MDX. "expert" is titled with the site's disclaimer title. */
export function Callout({ type = "tip", title, children }: { type?: keyof typeof styles; title?: string; children: ReactNode }) {
  const style = styles[type] ?? styles.tip;
  return (
    <aside className={`not-prose my-6 rounded-xl border-l-4 p-5 ${style.className}`}>
      <p className="font-semibold text-ink">{title ?? style.label}</p>
      <div className="mt-1 text-ink [&>p]:mt-2 first:[&>p]:mt-0">{children}</div>
    </aside>
  );
}
