export function CategoryTag({ title }: { title: string }) {
  return <span className="inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand-dark">{title}</span>;
}
