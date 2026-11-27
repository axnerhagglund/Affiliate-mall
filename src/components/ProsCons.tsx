/** <ProsCons pros={[...]} cons={[...]} /> in MDX. */
export function ProsCons({ pros = [], cons = [] }: { pros?: string[]; cons?: string[] }) {
  return (
    <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-900">Styrkor</p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink">
          {pros.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-emerald-700">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
        <p className="font-semibold text-rose-900">Svagheter</p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink">
          {cons.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-rose-700">
                −
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
