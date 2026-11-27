"use client";

import { type KeyboardEvent, type PointerEvent, useId, useRef, useState } from "react";

type Point = { year: number; count: number };

const WIDTH = 720;
const HEIGHT = 300;
const PAD = { top: 28, right: 24, bottom: 36, left: 56 };
const number = new Intl.NumberFormat("sv-SE");

/** Round the y-axis top up to a tidy step so gridlines land on round numbers. */
function niceMax(value: number) {
  const step = 500;
  return Math.ceil((value * 1.1) / step) * step;
}

/**
 * Registrations per year as a single-series line chart. Missing years break the
 * line instead of being interpolated. Hover or arrow keys move a crosshair with a
 * tooltip; the table on the page carries the same numbers for screen readers.
 */
export function RegistrationsChart({ data, label }: { data: Point[]; label: string }) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  if (data.length < 2) return null;
  const sorted = [...data].sort((a, b) => a.year - b.year);
  const first = sorted[0].year;
  const last = sorted[sorted.length - 1].year;
  const yMax = niceMax(Math.max(...sorted.map((p) => p.count)));
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (year: number) => PAD.left + ((year - first) / (last - first)) * plotW;
  const y = (count: number) => PAD.top + plotH - (count / yMax) * plotH;

  // Split into runs of consecutive years so a missing year leaves a gap.
  const runs: Point[][] = [];
  for (const point of sorted) {
    const run = runs[runs.length - 1];
    if (run && point.year === run[run.length - 1].year + 1) run.push(point);
    else runs.push([point]);
  }
  const gridSteps = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(yMax * f));
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const missing = years.filter((year) => !sorted.some((p) => p.year === year));
  const lastPoint = sorted[sorted.length - 1];
  const current = active === null ? null : sorted[active];

  function nearest(clientX: number) {
    const svg = svgRef.current;
    if (!svg) return null;
    const box = svg.getBoundingClientRect();
    const svgX = ((clientX - box.left) / box.width) * WIDTH;
    let best = 0;
    sorted.forEach((point, index) => {
      if (Math.abs(x(point.year) - svgX) < Math.abs(x(sorted[best].year) - svgX)) best = index;
    });
    return best;
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    setActive(nearest(event.clientX));
  }

  function onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key === "ArrowRight") setActive((i) => (i === null ? 0 : Math.min(sorted.length - 1, i + 1)));
    else if (event.key === "ArrowLeft") setActive((i) => (i === null ? sorted.length - 1 : Math.max(0, i - 1)));
    else if (event.key === "Escape") setActive(null);
    else return;
    event.preventDefault();
  }

  return (
    <figure className="not-prose relative my-6 rounded-xl border border-line bg-white p-4 shadow-sm">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full touch-pan-y select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        role="img"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
      >
        <title id={`${id}-title`}>{label}</title>
        <desc id={`${id}-desc`}>
          {`Från ${number.format(sorted[0].count)} år ${first} till ${number.format(lastPoint.count)} år ${last}.`}
          {missing.length > 0 && ` Uppgift saknas för ${missing.join(", ")}.`}
          {" Använd piltangenterna för att gå mellan åren."}
        </desc>

        {gridSteps.map((value) => (
          <g key={value}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(value)} y2={y(value)} stroke="#dde5dc" strokeWidth="1" />
            <text x={PAD.left - 10} y={y(value)} dy="0.32em" textAnchor="end" fontSize="12" fill="#4d5a51">
              {number.format(value)}
            </text>
          </g>
        ))}
        {years.map((year) => (
          <text key={year} x={x(year)} y={HEIGHT - 12} textAnchor="middle" fontSize="12" fill="#4d5a51">
            {(year - first) % 2 === 0 || year === last ? year : ""}
          </text>
        ))}

        {current && (
          <line
            x1={x(current.year)}
            x2={x(current.year)}
            y1={PAD.top}
            y2={PAD.top + plotH}
            stroke="#4d5a51"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {runs.map((run) =>
          run.length > 1 ? (
            <polyline
              key={run[0].year}
              points={run.map((p) => `${x(p.year)},${y(p.count)}`).join(" ")}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null,
        )}

        {sorted.map((point, index) => (
          <circle
            key={point.year}
            cx={x(point.year)}
            cy={y(point.count)}
            r={index === active ? 6 : 4}
            fill="var(--brand)"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        <text
          x={x(lastPoint.year)}
          y={y(lastPoint.count) - 14}
          textAnchor="end"
          fontSize="13"
          fontWeight="600"
          fill="#17211b"
        >
          {`${number.format(lastPoint.count)} (${lastPoint.year})`}
        </text>
      </svg>

      {current && (
        <div
          role="status"
          className="pointer-events-none absolute rounded-lg border border-line bg-white px-3 py-2 text-sm shadow-md"
          style={{
            left: `calc(${(x(current.year) / WIDTH) * 100}% + 1rem)`,
            top: "1rem",
            transform: x(current.year) > WIDTH * 0.6 ? "translateX(calc(-100% - 2rem))" : undefined,
          }}
        >
          <p className="font-semibold text-ink">{current.year}</p>
          <p className="text-muted">{number.format(current.count)} registrerade</p>
        </div>
      )}
    </figure>
  );
}
