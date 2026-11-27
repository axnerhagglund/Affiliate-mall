import { formatDate } from "@/lib/site";
import { affiliateLinkProps, affiliateUrl, formatPrice, getProduct, retailerName, sortedOffers } from "@/lib/products";
import { ProductImage } from "./ProductImage";

/**
 * <ProductCard id="..." /> in MDX. Everything comes from products.json; the
 * article slug is added to the links as sub-id. Cheapest offer first.
 */
export function ProductCard({ id, articleSlug }: { id: string; articleSlug: string }) {
  const product = getProduct(id);
  const [best, ...others] = sortedOffers(product);
  return (
    <aside id={`produkt-${product.id}`} className="not-prose relative my-8 scroll-mt-24 rounded-2xl border border-line bg-brand-soft/50 p-5 shadow-sm md:p-6">
      {product.badge && (
        <p className="absolute -top-3 left-5 rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white">{product.badge}</p>
      )}
      <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
        <ProductImage product={product} sizes="160px" />
        <div className="flex flex-col">
          <p className="font-display text-lg font-semibold text-ink">{product.name}</p>
          <p className="mt-1 text-sm text-ink/85">{product.shortDescription}</p>
          <p className="mt-2 text-xs text-muted">Annonslänk – vi får provision om du handlar, utan extra kostnad för dig.</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
            <div>
              <p className="text-2xl font-bold text-ink">
                {formatPrice(best.price)}
                {best.oldPrice && best.oldPrice > best.price && (
                  <s className="ml-2 text-sm font-normal text-muted">{formatPrice(best.oldPrice)}</s>
                )}
              </p>
              <p className="text-xs text-muted">
                Pris hos {retailerName(best)} {formatDate(best.priceCheckedAt)} – kan ha ändrats
              </p>
            </div>
            <a
              href={affiliateUrl(best, articleSlug)}
              {...affiliateLinkProps}
              className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Köp på {retailerName(best)}
            </a>
          </div>
          {others.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {others.map((offer) => (
                <li key={offer.retailer}>
                  <a href={affiliateUrl(offer, articleSlug)} {...affiliateLinkProps} className="text-brand-dark underline underline-offset-2">
                    {formatPrice(offer.price)} hos {retailerName(offer)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
