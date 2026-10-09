"use client";

// Adapted from Animata Bar Chart (MIT): https://animata.design/docs/graphs/bar-chart
// Changes for real data and accessibility: takes values instead of percentages; columns are
// capped at 24px with a 4px rounded data end on a hairline baseline; the peak column is
// direct-labelled; every column has a hover/keyboard tooltip; an sr-only table carries all
// values. Keeps Animata's grow-in animation (disabled by prefers-reduced-motion in globals.css).

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface BarChartItem {
  /** Short axis label, e.g. "Mar" */
  label: string;
  /** Long label for the tooltip and table, e.g. "March 2026" */
  fullLabel?: string;
  value: number;
}

interface BarChartProps {
  items: BarChartItem[];
  /** What a value counts, e.g. "registrations" (used in tooltips and the table) */
  unit: string;
  /** Chart title, used as the table caption */
  title: string;
  /** Plot height in px (labels are added below) */
  height?: number;
  className?: string;
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function BarChart({ items, unit, title, height = 160, className }: BarChartProps) {
  const [grown, setGrown] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    // Let the columns grow in once after mount
    const timeout = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  const max = Math.max(1, ...items.map((i) => i.value));
  const peakIndex = items.reduce((best, item, i) => (item.value > items[best].value ? i : best), 0);
  // Room above the tallest column for its value label
  const plotHeight = height - 22;
  const labelEvery = items.length > 12 ? Math.ceil(items.length / 12) : 1;

  return (
    <figure className={cn("w-full", className)}>
      <div className="relative flex items-end gap-[2px] border-b border-border-glass-hover" style={{ height }}>
        {items.map((item, i) => {
          const barHeight = grown ? (item.value / max) * plotHeight : 0;
          const name = item.fullLabel ?? item.label;
          return (
            <div
              key={`${item.label}-${i}`}
              tabIndex={0}
              role="img"
              aria-label={`${name}: ${fmt(item.value)} ${unit}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive((current) => (current === i ? null : current))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((current) => (current === i ? null : current))}
              className="group relative flex h-full flex-1 flex-col items-center justify-end outline-none"
            >
              {i === peakIndex && item.value > 0 && (
                <span className="mb-1 text-[11px] font-medium tabular-nums text-text-secondary">
                  {fmt(item.value)}
                </span>
              )}
              <div
                className={cn(
                  "w-full max-w-6 rounded-t-[4px] bg-[#2a78d6] transition-[height,opacity] duration-500 ease-out dark:bg-[#3987e5]",
                  active !== null && active !== i && "opacity-45",
                  "group-focus-visible:ring-2 group-focus-visible:ring-accent-blue/50 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg-card"
                )}
                style={{ height: item.value > 0 ? Math.max(barHeight, 2) : 0 }}
              />
              {active === i && (
                <div
                  role="presentation"
                  className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[calc(100%+4px)] whitespace-nowrap rounded-md border border-border-glass bg-bg-card px-2.5 py-1.5 text-xs shadow-lg"
                >
                  <div className="font-semibold tabular-nums text-text-primary">
                    {fmt(item.value)} <span className="font-normal text-text-muted">{unit}</span>
                  </div>
                  <div className="text-text-muted">{name}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-[2px]" aria-hidden="true">
        {items.map((item, i) => (
          <span key={`${item.label}-axis-${i}`} className="flex-1 truncate text-center text-[11px] text-text-muted">
            {i % labelEvery === 0 ? item.label : ""}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={`${item.label}-row-${i}`}>
              <th scope="row">{item.fullLabel ?? item.label}</th>
              <td>{fmt(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
