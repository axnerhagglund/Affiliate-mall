import Link from "next/link";
import { getCategory } from "@/config/sites";
import { type Doc, lastModified } from "@/lib/content";
import { formatDate } from "@/lib/site";
import { CategoryTag } from "./CategoryTag";
import { Picture } from "./Picture";

export function ArticleCard({ doc, headingLevel = "h3" }: { doc: Doc; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const category = doc.category ? getCategory(doc.category) : undefined;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Picture src={doc.frontmatter.image} alt="" className="rounded-none" sizes="(min-width: 768px) 33vw, 100vw" />
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <p>
            <CategoryTag title={category.title} />
          </p>
        )}
        <Heading className="mt-3 font-display text-lg font-semibold text-ink">
          <Link href={doc.href} className="after:absolute after:inset-0 group-hover:text-brand-dark">
            {doc.frontmatter.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{doc.frontmatter.lead}</p>
        <p className="mt-auto pt-4 text-xs text-muted">
          <time dateTime={lastModified(doc)}>{formatDate(lastModified(doc))}</time>
        </p>
      </div>
    </article>
  );
}
