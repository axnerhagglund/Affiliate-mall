import type { ReactNode } from "react";
import type { FaqItem } from "@/config/sites";
import { JsonLd } from "./JsonLd";
import { Kicker } from "./Kicker";

/** Questions as native disclosures, with FAQPage structured data. */
export function Faq({
  items,
  heading = "Vanliga frågor",
  kicker,
  intro,
  centered = false,
}: {
  items: FaqItem[];
  /** null when the surrounding text already has the heading. */
  heading?: string | null;
  kicker?: string;
  intro?: ReactNode;
  centered?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section
      aria-labelledby={heading ? "faq" : undefined}
      className={`not-prose ${centered ? "mx-auto max-w-3xl text-center" : heading ? "mt-12" : "mt-4"}`}
    >
      {kicker && <Kicker>{kicker}</Kicker>}
      {heading && (
        <h2 id="faq" className={`font-display text-3xl font-semibold text-ink ${kicker ? "mt-2" : ""}`}>
          {heading}
        </h2>
      )}
      {intro && <p className="mt-3 text-muted">{intro}</p>}
      <div className={`${heading ? "mt-6" : ""} space-y-3 text-left`}>
        {items.map((item) => (
          <details key={item.question} className="group rounded-xl border border-line bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="size-5 shrink-0 text-muted transition group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="m5 8 5 5 5-5" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </section>
  );
}
