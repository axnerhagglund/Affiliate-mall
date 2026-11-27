"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

const base = "relative py-2 text-muted transition hover:text-ink";
const activeLine =
  "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-[var(--accent)]";

/** Header links with the current section underlined. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return items.map((item) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <li key={item.href}>
        <Link href={item.href} aria-current={active ? "page" : undefined} className={`${base} ${active ? activeLine : ""}`}>
          {item.label}
        </Link>
      </li>
    );
  });
}

/** The same links without the active state, shown while the pathname is unknown. */
export function NavLinksFallback({ items }: { items: NavItem[] }) {
  return items.map((item) => (
    <li key={item.href}>
      <Link href={item.href} className={base}>
        {item.label}
      </Link>
    </li>
  ));
}
