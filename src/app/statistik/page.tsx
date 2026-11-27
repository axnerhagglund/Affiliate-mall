import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RegistrationsChart } from "@/components/RegistrationsChart";
import { site } from "@/config/sites";
import { getStats } from "@/lib/data";
import { statistics } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const stats = getStats();
const number = new Intl.NumberFormat("sv-SE");
const Name = `${site.topic[0].toUpperCase()}${site.topic.slice(1)}`;
const latest = [...stats.registrations].sort((a, b) => b.year - a.year)[0];

const title = `${Name} i siffror`;
const metaTitle = latest ? `${title} – ${number.format(latest.count)} registrerade ${latest.year}` : title;
const description = latest
  ? `Hur många ${site.topic} registreras i Sverige? ${number.format(latest.count)} hos SKK ${latest.year}. Registreringar per år, höfter, armbågar, ögon och hälsa – med källor.`
  : `Registreringar och hälsodata för ${site.topic}, med källor.`;

export const metadata: Metadata = pageMetadata({ path: "/statistik", title: metaTitle, description });

/** A small superscript-free source link after a value. */
function SourceLink({ id }: { id: string }) {
  const source = stats.sources[id];
  return (
    <a href={source.url} className="text-xs text-muted underline underline-offset-2 hover:text-brand-dark" rel="noopener">
      {source.name}
    </a>
  );
}

/** The statistics template: registrations per year, key figures and health tables, every value with its source. */
export default function Page() {
  // Statistics is an optional module (site.modules.statistics).
  if (!statistics) notFound();
  const registrations = [...stats.registrations].sort((a, b) => a.year - b.year);
  const usedSources = [
    ...new Set([
      ...registrations.map((row) => row.source),
      ...stats.facts.map((row) => row.source),
      ...stats.tables.map((row) => row.source),
    ]),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <Breadcrumbs items={[{ name: title, href: "/statistik" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-ink md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted">
        {latest
          ? `${number.format(latest.count)} ${site.topic} registrerades hos SKK ${latest.year}. Här är utvecklingen år för år och de viktigaste hälsosiffrorna för rasen, med källa för varje värde.`
          : description}
      </p>

      {registrations.length > 0 && (
        <section aria-labelledby="registrations" className="mt-12">
          <h2 id="registrations" className="font-display text-2xl font-semibold text-ink">
            Registreringar hos SKK per år
          </h2>
          <RegistrationsChart data={registrations} label={`Registrerade ${site.topic} hos SKK per år`} />
          {stats.registrationsNote && <p className="text-sm text-muted">{stats.registrationsNote}</p>}

          <details className="mt-4 rounded-xl border border-line bg-white p-4">
            <summary className="cursor-pointer font-semibold text-ink">Visa som tabell</summary>
            <table className="mt-3 w-full text-left text-sm">
              <caption className="sr-only">Registrerade {site.topic} hos SKK per år</caption>
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="py-2">
                    År
                  </th>
                  <th scope="col" className="py-2">
                    Registrerade
                  </th>
                  <th scope="col" className="py-2">
                    Källa
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((row) => (
                  <tr key={row.year} className="border-b border-line last:border-0">
                    <td className="py-2">{row.year}</td>
                    <td className="py-2">{number.format(row.count)}</td>
                    <td className="py-2">
                      <SourceLink id={row.source} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>
      )}

      {stats.facts.length > 0 && (
        <section aria-labelledby="facts" className="mt-12">
          <h2 id="facts" className="font-display text-2xl font-semibold text-ink">
            Rasen i korthet
          </h2>
          <dl className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
            {stats.facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 p-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                <dt className="text-ink">{fact.label}</dt>
                <dd className="sm:text-right">
                  <span className="block font-semibold text-ink">{fact.value}</span>
                  <SourceLink id={fact.source} />
                </dd>
              </div>
            ))}
          </dl>
          {stats.related.length > 0 && (
            <p className="mt-3 text-sm text-muted">
              Läs mer:{" "}
              {stats.related.map((link, index) => (
                <span key={link.href}>
                  {index > 0 && ", "}
                  <Link href={link.href} className="underline underline-offset-2">
                    {link.title}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </section>
      )}

      {stats.tables.map((table) => (
        <section key={table.title} className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">{table.title}</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-soft text-xs uppercase tracking-wide text-muted">
                <tr>
                  {table.columns.map((column) => (
                    <th key={column} scope="col" className="whitespace-nowrap px-4 py-3">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={index} scope="row" className="whitespace-nowrap px-4 py-2 font-semibold text-ink">
                          {cell}
                        </th>
                      ) : (
                        <td key={index} className="whitespace-nowrap px-4 py-2">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            <SourceLink id={table.source} />
          </p>
        </section>
      ))}

      {usedSources.length > 0 && (
        <section aria-labelledby="sources" className="mt-12 border-t border-line pt-6">
          <h2 id="sources" className="font-display text-xl font-semibold text-ink">
            Källor och metod
          </h2>
          {stats.method && <p className="mt-2 text-sm text-muted">{stats.method}</p>}
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            {usedSources.map((id) => (
              <li key={id}>
                <SourceLink id={id} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: `Registrerade ${site.topic} hos SKK per år`,
          description: `Antal ${site.topic} registrerade hos Svenska Kennelklubben per år, med källa för varje år.`,
          url: absoluteUrl("/statistik"),
          inLanguage: "sv-SE",
          isAccessibleForFree: true,
          creator: { "@type": "Organization", name: site.organization.name },
          citation: usedSources.map((id) => stats.sources[id].url),
          temporalCoverage: registrations.length
            ? `${registrations[0].year}/${registrations[registrations.length - 1].year}`
            : undefined,
        }}
      />
    </div>
  );
}
