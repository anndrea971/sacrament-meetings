const DAY_MS = 24 * 60 * 60 * 1000;

/** Format a Date as 'YYYY-MM-DD' using its local calendar fields. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * The most recent Sunday on or before `from` (today by default),
 * returned as an ISO date string.
 */
export function getMostRecentSunday(from: Date = new Date()): string {
  const sunday = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return toIsoDate(sunday);
}

/** Add whole weeks to an ISO date string and return a new ISO date string. */
export function addWeeks(isoDate: string, weeks: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d) + weeks * 7 * DAY_MS;
  const result = new Date(utc);
  const yy = result.getUTCFullYear();
  const mm = String(result.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(result.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/** True when the string looks like 'YYYY-MM-DD'. */
export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** e.g. 'Sunday, November 8, 2026' from '2026-11-08'. */
export function formatMeetingDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Short form, e.g. 'Nov 8' and the year separately for card layouts. */
export function formatShortDate(isoDate: string): { month: string; day: string; year: string } {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
    day: String(d),
    year: String(y),
  };
}
