import { headers } from 'next/headers';
import type { SacramentMeeting } from './types';

/**
 * Server Components need an absolute URL to call our own API routes.
 * Build it from the incoming request headers so it works locally,
 * on Vercel previews, and in production without extra configuration.
 */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/** Fetch every meeting (newest first) from GET /api/meetings. */
export async function fetchMeetings(): Promise<SacramentMeeting[]> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/meetings`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to load meetings (HTTP ${res.status}).`);
  }
  return (await res.json()) as SacramentMeeting[];
}

/**
 * Fetch one meeting from GET /api/meetings/[id].
 * Returns null for a bad id (400) or a missing meeting (404).
 */
export async function fetchMeeting(id: string): Promise<SacramentMeeting | null> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/meetings/${encodeURIComponent(id)}`, { cache: 'no-store' });

  if (res.status === 400 || res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to load meeting ${id} (HTTP ${res.status}).`);
  }
  return (await res.json()) as SacramentMeeting;
}

/** Fetch the meeting held on a given ISO date, if there is one. */
export async function fetchMeetingByDate(date: string): Promise<SacramentMeeting | null> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/meetings?date=${encodeURIComponent(date)}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to load meeting for ${date} (HTTP ${res.status}).`);
  }
  const results = (await res.json()) as SacramentMeeting[];
  return results[0] ?? null;
}
