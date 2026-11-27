import Link from "next/link";
import { site } from "@/config/sites";
import { BREEDER_MAP_PATH, breederMap } from "@/lib/nav";
import { Chevron } from "./Chevron";
import { Kicker } from "./Kicker";

/** Dark full-width call to action (mainCta in the site config). */
export function MainCtaBand() {
  const cta = site.mainCta;
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{cta.kicker}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{cta.title}</h2>
        <p className="mt-4 text-white/80">{cta.text}</p>
        <Link
          href={cta.href}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          {cta.label} <Chevron />
        </Link>
      </div>
    </section>
  );
}

/** Light full-width call to action for the breeder map; nothing when the module is off. */
export function BreederBand() {
  if (!breederMap) return null;
  const cta = breederMap.cta;
  return (
    <section className="border-t border-line bg-brand-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
        <div>
          <Kicker>{cta.kicker}</Kicker>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">{cta.title}</h2>
          <p className="mt-2 text-muted">{cta.text}</p>
        </div>
        <Link
          href={BREEDER_MAP_PATH}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          {cta.label} <Chevron />
        </Link>
      </div>
    </section>
  );
}
