import { absoluteUrl } from "@/lib/site";
import { affiliateLinkProps, affiliateUrl, formatPrice, getProduct, retailerName, sortedOffers } from "@/lib/products";
import { JsonLd } from "./JsonLd";
import { ProductImage } from "./ProductImage";

/**
 * <ProductTable ids={[...]} /> at the top of a buying guide: name, who it suits,
 * lowest price and a button. Also emits ItemList structured data in that order.
 * No Product or Review markup: we have no ratings to back it.
 */
export function ProductTable({ ids, articleSlug, articleHref }: { ids: string[]; articleSlug: string; articleHref: string }) {
  const products = ids.map(getProduct);
  return (
    <div className="not-prose my-8">
      <table className="hidden w-full overflow-hidden rounded-xl border border-line bg-white text-left text-sm shadow-sm md:table">
        <caption className="sr-only">Jämförelse av produkterna i guiden</caption>
        <thead className="bg-brand-soft text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3">
              Produkt
            </th>
            <th scope="col" className="px-4 py-3">
              Passar för
            </th>
            <th scope="col" className="px-4 py-3">
              Pris från
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Köp</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product, index) => {
            const best = sortedOffers(product)[0];
            return (
              <tr key={product.id}>
                <th scope="row" className="px-4 py-3 font-normal">
                  <div className="flex items-center gap-3">
                    <span className="w-14 shrink-0">
                      <ProductImage product={product} sizes="56px" />
                    </span>
                    <span>
                      <span className="text-muted">{index + 1}. </span>
                      <a href={`#produkt-${product.id}`} className="font-semibold text-ink hover:text-brand-dark">
                        {product.name}
                      </a>
                      {product.badge && <span className="mt-0.5 block text-xs font-semibold text-brand-dark">{product.badge}</span>}
                    </span>
                  </div>
                </th>
                <td className="px-4 py-3 text-muted">{product.bestFor ?? "–"}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">{formatPrice(best.price)}</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={affiliateUrl(best, articleSlug)}
                    {...affiliateLinkProps}
                    className="inline-block whitespace-nowrap rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
                  >
                    Köp på {retailerName(best)}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ol className="space-y-3 md:hidden">
        {products.map((product, index) => {
          const best = sortedOffers(product)[0];
          return (
            <li key={product.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 shadow-sm">
              <span className="w-16 shrink-0">
                <ProductImage product={product} sizes="64px" />
              </span>
              <div className="min-w-0 flex-1">
                <a href={`#produkt-${product.id}`} className="font-semibold text-ink">
                  {index + 1}. {product.name}
                </a>
                {product.bestFor && <p className="text-xs text-muted">{product.bestFor}</p>}
                <a href={affiliateUrl(best, articleSlug)} {...affiliateLinkProps} className="mt-1 inline-block text-sm font-semibold text-brand-dark underline">
                  {formatPrice(best.price)} hos {retailerName(best)}
                </a>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted">Annonslänkar. Priserna kan ha ändrats sedan vi kontrollerade dem.</p>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: absoluteUrl(`${articleHref}#produkt-${product.id}`),
          })),
        }}
      />
    </div>
  );
}
