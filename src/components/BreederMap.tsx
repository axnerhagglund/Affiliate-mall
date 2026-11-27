"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Breeder } from "@/lib/data";
import { describeKennel } from "@/lib/kennel-description";

/** Kennels listed before "Visa alla" when no county is chosen. */
const LIST_PREVIEW = 12;

/** Sweden, roughly, for the initial view and when the filter leaves no kennel. */
const SWEDEN_BOUNDS: [[number, number], [number, number]] = [
  [55.2, 10.9],
  [69.1, 24.2],
];

/**
 * Kennels on an OpenStreetMap map with a county filter, plus the same kennels as
 * a list (the list is the accessible version and works without JavaScript's map).
 * Markers sit on the town, never on an address.
 */
export function BreederMap({ breeders, counties }: { breeders: Breeder[]; counties: readonly string[] }) {
  const selectId = useId();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [county, setCounty] = useState("");
  const [ready, setReady] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [onlyLitter, setOnlyLitter] = useState(false);
  const litterId = useId();
  const withLitter = useMemo(() => breeders.filter((breeder) => breeder.litter).length, [breeders]);
  const panelRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const breeder of breeders) {
      if (onlyLitter && !breeder.litter) continue;
      map.set(breeder.county, (map.get(breeder.county) ?? 0) + 1);
    }
    return map;
  }, [breeders, onlyLitter]);

  const visible = useMemo(
    () =>
      breeders
        .filter((breeder) => !county || breeder.county === county)
        .filter((breeder) => !onlyLitter || breeder.litter)
        .sort((a, b) => a.kennel.localeCompare(b.kennel, "sv")),
    [breeders, county, onlyLitter],
  );

  const selected = visible.find((breeder) => keyOf(breeder) === selectedKey) ?? null;

  function select(breeder: Breeder, scroll: boolean) {
    setSelectedKey(keyOf(breeder));
    if (scroll) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  // Create the map once, on the client only (Leaflet needs window).
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapElement.current || mapRef.current) return;
      const map = L.map(mapElement.current, { scrollWheelZoom: false }).fitBounds(SWEDEN_BOUNDS);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw markers whenever the filter changes.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !map || !layer) return;
    import("leaflet").then((L) => {
      layer.clearLayers();
      for (const breeder of visible) {
        const marker = L.circleMarker([breeder.lat, breeder.lng], {
          radius: 8,
          color: "#ffffff",
          weight: 2,
          fillColor: getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#2f5d46",
          fillOpacity: 1,
        });
        marker.bindTooltip(breeder.kennel).on("click", () => select(breeder, true));
        layer.addLayer(marker);
      }
      if (visible.length) {
        map.fitBounds(
          L.latLngBounds(visible.map((b) => [b.lat, b.lng] as [number, number])).pad(0.3),
          { maxZoom: 9 },
        );
      } else {
        map.fitBounds(SWEDEN_BOUNDS);
      }
    });
  }, [visible, ready]);

  return (
    <div className="not-prose">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor={selectId} className="block text-sm font-semibold text-ink">
            Län
          </label>
          <select
            id={selectId}
            value={county}
            onChange={(event) => setCounty(event.target.value)}
            className="mt-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
          >
            <option value="">
              Alla län ({onlyLitter ? withLitter : breeders.length})
            </option>
            {counties.map((name) => (
              <option key={name} value={name} disabled={!counts.get(name) && name !== county}>
                {name} ({counts.get(name) ?? 0})
              </option>
            ))}
          </select>
        </div>
        {withLitter > 0 && (
          <label htmlFor={litterId} className="flex cursor-pointer items-center gap-2 py-2 text-sm font-medium text-ink">
            <input
              id={litterId}
              type="checkbox"
              checked={onlyLitter}
              onChange={(event) => setOnlyLitter(event.target.checked)}
              className="size-4 accent-[var(--brand)]"
            />
            Bara med aktuell kull ({withLitter})
          </label>
        )}
        <p className="text-sm text-muted" role="status">
          {visible.length === 1 ? "1 kennel" : `${visible.length} kennlar`}
          {onlyLitter && " med aktuell kull"}
          {county && ` i ${county}`}
        </p>
      </div>

      <div
        ref={mapElement}
        className="relative z-0 mt-4 h-[28rem] w-full overflow-hidden rounded-xl border border-line bg-brand-soft"
        aria-label="Karta över kennlar"
        role="region"
      />

      {selected && (
        <div ref={panelRef} className="mt-6 scroll-mt-24">
          <BreederPanel breeder={selected} onClose={() => setSelectedKey(null)} />
        </div>
      )}

      {visible.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(county || onlyLitter || showAll ? visible : visible.slice(0, LIST_PREVIEW)).map((breeder) => {
            const isSelected = keyOf(breeder) === selectedKey;
            return (
              <li key={keyOf(breeder)} className="min-w-0">
                <button
                  type="button"
                  onClick={() => select(breeder, true)}
                  aria-expanded={isSelected}
                  className={`flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left shadow-sm transition hover:border-brand ${
                    isSelected ? "border-2 border-[var(--accent)]" : "border-line"
                  }`}
                >
                  <Initial name={breeder.kennel} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg font-semibold text-brand-dark">{breeder.kennel}</span>
                    <span className="block text-sm text-muted">
                      {breeder.town} · {breeder.county}
                    </span>
                    {breeder.litter && (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark">
                        <span aria-hidden="true" className="size-2 rounded-full bg-[var(--accent)]" />
                        Aktuell kull
                      </span>
                    )}
                  </span>
                  {breeder.skk && <SkkBadge />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {!county && !onlyLitter && !showAll && visible.length > LIST_PREVIEW && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-brand-dark hover:border-brand"
        >
          Visa alla {visible.length} kennlar
        </button>
      )}
    </div>
  );
}

const keyOf = (breeder: Breeder) => `${breeder.kennel}|${breeder.town}`;

/** The kennel's first letter, ignoring a leading "Kennel". */
function Initial({ name, large = false }: { name: string; large?: boolean }) {
  const letter = name.replace(/^kennel\s+/i, "").charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-xl font-display font-semibold ${
        large
          ? "size-16 border border-[var(--accent)]/60 bg-[var(--accent)]/20 text-2xl text-[var(--accent)]"
          : "size-12 bg-brand-soft text-xl text-brand-dark"
      }`}
    >
      {letter}
    </span>
  );
}

function SkkBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        dark ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-brand-soft text-brand-dark"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 2.5 4 5v4.5c0 3.6 2.6 6.6 6 7.5 3.4-.9 6-3.9 6-7.5V5l-6-2.5Z" />
        <path d="m7.5 10 1.8 1.8 3.4-3.6" />
      </svg>
      SKK
    </span>
  );
}

/** The dark detail card for the selected kennel. Optional fields are left out when empty. */
function BreederPanel({ breeder, onClose }: { breeder: Breeder; onClose: () => void }) {
  const description = describeKennel(breeder);
  return (
    <article className="relative rounded-2xl bg-ink p-6 text-white shadow-lg md:p-8" aria-label={breeder.kennel}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        aria-label="Stäng"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m5 5 10 10M15 5 5 15" />
        </svg>
      </button>
      <Initial name={breeder.kennel} large />
      {(breeder.skk || breeder.tags.length > 0) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {breeder.skk && <SkkBadge dark />}
          {breeder.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
              <span aria-hidden="true" className="size-2 rounded-full bg-[var(--accent)]" />
              {tag}
            </span>
          ))}
        </div>
      )}
      <h3 className="mt-3 font-display text-3xl font-semibold">{breeder.kennel}</h3>
      <p className="mt-2 flex items-center gap-2 text-white/85">
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M10 18s6-5.2 6-10A6 6 0 0 0 4 8c0 4.8 6 10 6 10Z" />
          <circle cx="10" cy="8" r="2" />
        </svg>
        {breeder.town}, {breeder.county}
      </p>
      {breeder.owners && <p className="mt-1 text-white/60">{breeder.owners}</p>}
      {(description || breeder.email) && (
        <div className="mt-5 max-w-2xl border-t border-white/15 pt-5">
          {description && <p className="leading-relaxed text-white/85">{description}</p>}
          {breeder.email && (
            <p className={description ? "mt-3" : undefined}>
              <a href={`mailto:${breeder.email}`} className="break-all text-[var(--accent)] hover:underline">
                {breeder.email}
              </a>
            </p>
          )}
        </div>
      )}
      {breeder.litter && <LitterFacts litter={breeder.litter} />}
      {breeder.url && (
        <a
          href={breeder.url}
          rel="noopener"
          target="_blank"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 font-semibold text-ink hover:brightness-95"
        >
          Besök hemsida
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M11 4h5v5M16 4l-7 7M14 12v4H4V6h4" />
          </svg>
        </a>
      )}
      {breeder.source && (
        <p className="mt-5 text-xs text-white/50">
          Uppgifterna kommer från{" "}
          <a href={breeder.source.url} rel="noopener" className="underline underline-offset-2 hover:text-white/80">
            {breeder.source.name}
          </a>
          , senast ändrade {formatDay(breeder.source.lastSeen)}.
        </p>
      )}
    </article>
  );
}

const dayFormat = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const formatDay = (iso: string) => dayFormat.format(new Date(`${iso}T12:00:00Z`));

/** The litter the kennel currently has listed with the site club. */
function LitterFacts({ litter }: { litter: NonNullable<Breeder["litter"]> }) {
  const rows: [string, string][] = [];
  if (litter.born) rows.push(["Född", formatDay(litter.born)]);
  else if (litter.expected) rows.push(["Beräknas", formatDay(litter.expected)]);
  if (litter.delivery) rows.push(["Leverans", formatDay(litter.delivery)]);
  if (litter.puppies) rows.push(["Antal valpar", String(litter.puppies)]);
  if (litter.sire) rows.push(["Far", litter.sire]);
  if (litter.dam) rows.push(["Mor", litter.dam]);
  if (!rows.length) return null;
  return (
    <div className="mt-5 max-w-2xl rounded-xl bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Aktuell kull via rasklubben</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-white/60">{label}</dt>
            <dd className="text-white/90">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
