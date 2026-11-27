import Link from "next/link";
import { getVisibleCategories } from "@/lib/content";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Sidan finns inte</h1>
      <p className="mt-4 text-lg text-muted">Den kan ha flyttats. Börja i någon av kategorierna i stället.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {getVisibleCategories().map((category) => (
          <li key={category.slug}>
            <Link href={`/${category.slug}`} className="block rounded-xl border border-line bg-white p-4 hover:border-brand">
              <span className="font-semibold text-ink">{category.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/" className="font-semibold text-brand-dark underline">
          Till startsidan
        </Link>
      </p>
    </div>
  );
}
