import type { ReactNode } from "react";

/** Marks a section that a later phase fills in. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border-2 border-dashed border-line p-6 text-center text-muted">{children}</div>
  );
}
