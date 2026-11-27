import type { Heading } from "@/lib/content";

export function Toc({ headings }: { headings: Heading[] }) {
  return (
    <nav aria-labelledby="toc" className="my-8 rounded-xl border border-line bg-white p-5">
      <p id="toc" className="font-semibold text-ink">
        Innehåll
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className="text-muted hover:text-brand-dark">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
