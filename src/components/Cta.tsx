import Link from "next/link";

export function Cta({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand-soft p-8 md:flex-row md:items-center">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-muted">{text}</p>
      </div>
      <Link href={href} className="shrink-0 rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">
        {label}
      </Link>
    </section>
  );
}
