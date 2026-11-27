import Link from "next/link";
import Image from "next/image";
import type { Doc } from "@/lib/content";
import { Chevron } from "./Chevron";

/** One large image card and up to two text cards beside it. */
export function FeaturedGuides({ docs }: { docs: Doc[] }) {
  const [main, ...rest] = docs;
  if (!main) return null;
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <article className="group relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-brand-dark p-8 text-white shadow-sm">
        {main.frontmatter.image ? (
          <Image src={main.frontmatter.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-brand to-brand-dark" />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/60 to-black/20" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Utvald guide</p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-snug md:text-3xl">
          <Link href={main.href} className="after:absolute after:inset-0">
            {main.frontmatter.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-white/85">{main.frontmatter.lead}</p>
        <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
          Läs guiden <Chevron />
        </p>
      </article>
      <div className="grid gap-6">
        {rest.slice(0, 2).map((doc) => (
          <article
            key={doc.href}
            className="group relative flex items-center gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Utvald guide</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                <Link href={doc.href} className="after:absolute after:inset-0 group-hover:text-brand-dark">
                  {doc.frontmatter.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{doc.frontmatter.lead}</p>
            </div>
            <Chevron className="size-5 shrink-0 text-brand" />
          </article>
        ))}
      </div>
    </div>
  );
}
