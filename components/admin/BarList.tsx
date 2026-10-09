import { cn } from "@/lib/utils";

type Row = { label: string; value: number; href?: string };

/**
 * Ranked horizontal bars (label + value on one line, a thin bar below).
 * One series, so a single hue; text uses text tokens, never the bar colour.
 */
export function BarList({
  rows,
  unit,
  emptyText = "No data for this period.",
  className,
}: {
  rows: Row[];
  /** e.g. "views", used in the accessible description of each row */
  unit: string;
  emptyText?: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-text-muted">{emptyText}</p>;
  }

  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <ul className={cn("flex flex-col gap-3 px-4 py-4", className)}>
      {rows.map((row) => {
        const label = row.href ? (
          <a
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-text-secondary hover:text-text-primary hover:underline"
          >
            {row.label}
          </a>
        ) : (
          <span className="truncate text-text-secondary">{row.label}</span>
        );
        return (
          <li key={row.label} aria-label={`${row.label}: ${row.value.toLocaleString("en-US")} ${unit}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              {label}
              <span className="shrink-0 font-medium tabular-nums text-text-primary">
                {row.value.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-1.5 w-full" aria-hidden="true">
              <div
                className="h-full rounded-r-[4px] bg-[#2a78d6] dark:bg-[#3987e5]"
                style={{ width: `${row.value > 0 ? Math.max((row.value / max) * 100, 1.5) : 0}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
