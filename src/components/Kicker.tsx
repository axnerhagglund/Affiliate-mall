import type { ReactNode } from "react";

/** Small upper-case label above a section heading. */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark ${className}`}>{children}</p>;
}
