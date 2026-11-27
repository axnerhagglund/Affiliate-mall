import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreederMap } from "@/components/BreederMap";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Callout } from "@/components/Callout";
import { site } from "@/config/sites";
import { counties } from "@/config/counties";
import { getBreeders } from "@/lib/data";
import { breederMap } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

const { kennels, externalLists, scrape, sourceSummary } = getBreeders();
const sourceNames = sourceSummary ?? [scrape?.register?.name, scrape?.litters?.name].filter(Boolean).join(" och ");
const title = `Hitta ${site.topic}-uppfödare nära dig`;
const description = kennels.length
  ? `Karta och lista med ${kennels.length} kennlar som föder upp ${site.topic} i Sverige. Filtrera på län och se vad du ska kontrollera innan du köper valp.`
  : `Hitta uppfödare av ${site.topic} i Sverige, filtrera på län och se vad du ska kontrollera hos uppfödaren innan du köper valp.`;

export const metadata: Metadata = pageMetadata({ path: "/uppfodare", title, description });

/** The breeder map template. */
export default function Page() {
  // The breeder map is an optional module (site.modules.breederMap).
  if (!breederMap) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <Breadcrumbs items={[{ name: "Hitta uppfödare", href: "/uppfodare" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-ink md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
      {sourceNames && (
        <p className="mt-4 max-w-2xl rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink">
          <strong className="font-semibold">Kartan är information, inte en rekommendation.</strong> Uppgifterna kommer
          från {sourceNames}. Rasklubben är ansluten till Svenska Kennelklubben (SKK), och kartan visar uppfödare i Sverige
          som finns i klubbens listor. Kontrollera alltid föräldrarnas hälsa och meriter själv innan du köper valp.
        </p>
      )}

      <div className="mt-8">
        <BreederMap breeders={kennels} counties={counties} />
      </div>

      {kennels.length === 0 && (
        <p className="mt-4 max-w-2xl text-muted">
          Vi har inte lagt in några kennlar på kartan än. Tills dess hittar du aktuella kullar i listorna nedan.
        </p>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {externalLists.length > 0 && (
          <section aria-labelledby="external">
            <h2 id="external" className="font-display text-2xl font-semibold text-ink">
              Aktuella valpkullar
            </h2>
            <p className="mt-2 text-muted">Kullar och uppfödare listas också här, med kontaktuppgifter från uppfödarna själva:</p>
            <ul className="mt-3 space-y-2">
              {externalLists.map((list) => (
                <li key={list.url}>
                  <a href={list.url} rel="noopener" className="font-semibold text-brand-dark underline underline-offset-2">
                    {list.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="check">
          <h2 id="check" className="font-display text-2xl font-semibold text-ink">
            Innan du kontaktar en uppfödare
          </h2>
          <Callout type="tip">
            <p>
              Att en kennel finns på kartan är ingen kvalitetsstämpel. Be om föräldrarnas hälsoresultat och kontrollera dem
              själv. Vad du ska fråga efter står i{" "}
              <Link href={site.mainCta.href} className="underline underline-offset-2">
                våra guider om att köpa valp
              </Link>
              .
            </p>
          </Callout>
        </section>
      </div>

      <section aria-labelledby="about-map" className="mt-10 max-w-2xl text-sm text-muted">
        <h2 id="about-map" className="font-semibold text-ink">
          Om kartan
        </h2>
        <p className="mt-2">
          Kennlarna hämtas från rasklubbens uppfödarlista och kullarna från rasklubbens valphänvisning, där bara kullar som
          uppfyller klubbens krav på hälsa och meriter listas. Markeringarna sitter på orten, inte på någon adress.
          Telefonnummer och adresser visar vi inte.
        </p>
        <p className="mt-2">
          Är du uppfödare och vill inte synas här?{" "}
          {site.organization.email ? (
            <>
              Mejla{" "}
              <a href={`mailto:${site.organization.email}`} className="underline underline-offset-2">
                {site.organization.email}
              </a>{" "}
              så tar vi bort kenneln och lägger inte till den igen.
            </>
          ) : (
            <>
              <Link href="/om-oss" className="underline underline-offset-2">
                Kontakta oss
              </Link>{" "}
              så tar vi bort kenneln och lägger inte till den igen.
            </>
          )}
        </p>
      </section>
    </div>
  );
}
