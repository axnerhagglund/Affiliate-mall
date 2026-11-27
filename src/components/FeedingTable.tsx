/**
 * <FeedingTable rows={[{ weight: "25 kg", amount: "300–350 g" }]} source={{ name, url }} /> in MDX.
 * Guide values from the manufacturer, never our own dosing advice.
 */
export function FeedingTable({
  rows,
  caption = "Utfodringsguide",
  weightLabel = "Kroppsvikt",
  amountLabel = "Gram per dag",
  source,
}: {
  rows: { weight: string; amount: string }[];
  caption?: string;
  weightLabel?: string;
  amountLabel?: string;
  source?: { name: string; url: string };
}) {
  return (
    <figure className="not-prose my-6">
      <table className="w-full overflow-hidden rounded-xl border border-line bg-white text-left text-sm shadow-sm">
        <caption className="bg-brand-soft px-4 py-3 text-left font-semibold text-ink">{caption}</caption>
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-2">
              {weightLabel}
            </th>
            <th scope="col" className="px-4 py-2">
              {amountLabel}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.weight}>
              <td className="px-4 py-2">{row.weight}</td>
              <td className="px-4 py-2">{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-2 text-xs text-muted">
        Riktvärden. Följ förpackningen och justera efter behov.
        {source && (
          <>
            {" "}
            Källa:{" "}
            <a href={source.url} className="underline" rel="noopener">
              {source.name}
            </a>
            .
          </>
        )}
      </figcaption>
    </figure>
  );
}
