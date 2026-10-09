/**
 * Pure helpers for the admin analytics (no server/client APIs, so both sides can use them).
 * Everything works in UTC so server- and browser-rendered labels always match.
 */

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type MonthBucket = { key: string; label: string; fullLabel: string; value: number };
export type Tally = { label: string; value: number };

export function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Start (UTC) of the month `monthsBack` months before `now`'s month. 0 = this month. */
export function startOfMonthUTC(now: Date, monthsBack = 0): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsBack, 1));
}

/** Consecutive month buckets from `start`'s month to `end`'s month (inclusive), all zero. */
export function emptyMonths(start: Date, end: Date): MonthBucket[] {
  const spansYears = start.getUTCFullYear() !== end.getUTCFullYear();
  const buckets: MonthBucket[] = [];
  const cursor = startOfMonthUTC(start);
  const last = startOfMonthUTC(end);
  while (cursor <= last) {
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth();
    buckets.push({
      key: monthKey(cursor),
      label: spansYears ? `${MONTH_SHORT[m]} ${String(y).slice(2)}` : MONTH_SHORT[m],
      fullLabel: `${MONTH_LONG[m]} ${y}`,
      value: 0,
    });
    cursor.setUTCMonth(m + 1);
  }
  return buckets;
}

/** Count dates per month across [start, end]. Dates outside the range are ignored. */
export function countByMonth(dates: Date[], start: Date, end: Date): MonthBucket[] {
  const buckets = emptyMonths(start, end);
  const index = new Map(buckets.map((b, i) => [b.key, i]));
  for (const d of dates) {
    const i = index.get(monthKey(d));
    if (i !== undefined) buckets[i].value += 1;
  }
  return buckets;
}

/** "nigeria" / " Nigeria " → "Nigeria", so free-text values group together. */
export function normalizeLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
}

/** Count items by one or more keys each (e.g. skills), sorted by count, then name. */
export function tally<T>(items: T[], keys: (item: T) => string | string[] | null | undefined): Tally[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const raw = keys(item);
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const value of new Set(list.map((v) => v.trim()).filter(Boolean))) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

/** Sum a number per key, sorted descending. */
export function sumBy<T>(items: T[], key: (item: T) => string, amount: (item: T) => number): Tally[] {
  const sums = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    sums.set(k, (sums.get(k) ?? 0) + amount(item));
  }
  return [...sums.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

/** Keep the top `n` rows and fold the rest into "Other". */
export function topWithOther(rows: Tally[], n: number): Tally[] {
  if (rows.length <= n) return rows;
  const rest = rows.slice(n).reduce((sum, r) => sum + r.value, 0);
  return [...rows.slice(0, n), { label: "Other", value: rest }];
}

export function percent(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}
