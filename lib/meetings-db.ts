import { neon } from '@neondatabase/serverless';
import { getMostRecentSunday } from './dates';
import type { Hymn, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from './types';

export const MEETINGS_PER_PAGE = 5;

/** One page of search results plus what the UI needs to draw the pagination. */
export interface MeetingsPage {
  meetings: SacramentMeeting[];
  total: number;
  totalPages: number;
  page: number;
  query: string;
}

/** A row as it comes back from the `meetings` table (snake_case columns). */
interface MeetingRow {
  id: number;
  date_iso: string;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[] | null;
  stake_business: boolean | null;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[] | null;
  closing_hymn: Hymn;
  closing_prayer: string;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Run "vercel env pull .env.local" and restart the dev server.',
    );
  }
  return neon(url);
}

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date_iso,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

/** Escape LIKE wildcards so a search for "50%" matches the text "50%" literally. */
function toLikePattern(query: string): string | null {
  const trimmed = query.trim();
  if (trimmed === '') {
    return null;
  }
  return `%${trimmed.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

/**
 * All meetings, newest first.
 * When `date` ('YYYY-MM-DD') is given, only meetings on that date are returned.
 */
export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT *, to_char(date, 'YYYY-MM-DD') AS date_iso
    FROM meetings
    WHERE ${date ?? null}::date IS NULL OR date = ${date ?? null}::date
    ORDER BY date DESC
  `) as MeetingRow[];
  return rows.map(toMeeting);
}

/**
 * One page of meetings, filtered by a search term.
 * The term matches presiding, conducting, meeting type, and speaker names.
 */
export async function getMeetingsPage(options: {
  query?: string;
  page?: number;
}): Promise<MeetingsPage> {
  const sql = getSql();
  const query = (options.query ?? '').trim();
  const pattern = toLikePattern(query);

  const countRows = (await sql`
    SELECT COUNT(*)::int AS count
    FROM meetings
    WHERE ${pattern}::text IS NULL
       OR presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(speakers) AS s
         WHERE s->>'name' ILIKE ${pattern}
       )
  `) as { count: number }[];

  const total = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / MEETINGS_PER_PAGE));
  const requested = Number.isInteger(options.page) && (options.page ?? 1) > 0 ? options.page! : 1;
  const page = Math.min(requested, totalPages);
  const offset = (page - 1) * MEETINGS_PER_PAGE;

  const rows = (await sql`
    SELECT *, to_char(date, 'YYYY-MM-DD') AS date_iso
    FROM meetings
    WHERE ${pattern}::text IS NULL
       OR presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(speakers) AS s
         WHERE s->>'name' ILIKE ${pattern}
       )
    ORDER BY date DESC
    LIMIT ${MEETINGS_PER_PAGE} OFFSET ${offset}
  `) as MeetingRow[];

  return { meetings: rows.map(toMeeting), total, totalPages, page, query };
}

/** A single meeting by numeric id, or undefined when none exists. */
export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  // A SERIAL id is a 32-bit integer; anything larger cannot exist.
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    return undefined;
  }
  const sql = getSql();
  const rows = (await sql`
    SELECT *, to_char(date, 'YYYY-MM-DD') AS date_iso
    FROM meetings
    WHERE id = ${id}
  `) as MeetingRow[];
  return rows[0] ? toMeeting(rows[0]) : undefined;
}

/** The meeting held on the most recent Sunday, or undefined when there is none. */
export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const matches = await getMeetings(getMostRecentSunday());
  return matches[0];
}

// --- Mutation stubs: wired to the database in Week 04 when the forms are built. ---

export type NewMeeting = Omit<SacramentMeeting, 'id'>;

export async function addMeeting(meeting: NewMeeting): Promise<SacramentMeeting> {
  void meeting;
  throw new Error('addMeeting is not implemented until Week 04.');
}

export async function updateMeeting(
  id: number,
  changes: Partial<NewMeeting>,
): Promise<SacramentMeeting | undefined> {
  void id;
  void changes;
  throw new Error('updateMeeting is not implemented until Week 04.');
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error('deleteMeeting is not implemented until Week 04.');
}
