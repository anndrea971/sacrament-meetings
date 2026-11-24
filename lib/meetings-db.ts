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

// --- Mutations (Week 04) ---

export type NewMeeting = Omit<SacramentMeeting, 'id'>;

/** Postgres error code for a UNIQUE violation (two meetings on the same date). */
export const UNIQUE_VIOLATION = '23505';

export async function addMeeting(meeting: NewMeeting): Promise<SacramentMeeting> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${meeting.date}::date, ${meeting.meetingType}, ${meeting.presiding}, ${meeting.conducting},
      ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(meeting.announcements ?? [])}::jsonb)),
      ${JSON.stringify(meeting.openingHymn)}::jsonb, ${meeting.openingPrayer},
      ${JSON.stringify(meeting.wardBusiness)}::jsonb, ${meeting.stakeBusiness},
      ${JSON.stringify(meeting.sacramentHymn)}::jsonb, ${JSON.stringify(meeting.speakers)}::jsonb,
      ${JSON.stringify(meeting.closingHymn)}::jsonb, ${meeting.closingPrayer}
    )
    RETURNING *, to_char(date, 'YYYY-MM-DD') AS date_iso
  `) as MeetingRow[];
  return toMeeting(rows[0]);
}

/** Replaces every editable field of one meeting. Returns undefined when the id does not exist. */
export async function updateMeeting(
  id: number,
  meeting: NewMeeting,
): Promise<SacramentMeeting | undefined> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE meetings SET
      date = ${meeting.date}::date,
      meeting_type = ${meeting.meetingType},
      presiding = ${meeting.presiding},
      conducting = ${meeting.conducting},
      announcements = ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(meeting.announcements ?? [])}::jsonb)),
      opening_hymn = ${JSON.stringify(meeting.openingHymn)}::jsonb,
      opening_prayer = ${meeting.openingPrayer},
      ward_business = ${JSON.stringify(meeting.wardBusiness)}::jsonb,
      stake_business = ${meeting.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
      speakers = ${JSON.stringify(meeting.speakers)}::jsonb,
      closing_hymn = ${JSON.stringify(meeting.closingHymn)}::jsonb,
      closing_prayer = ${meeting.closingPrayer}
    WHERE id = ${id}
    RETURNING *, to_char(date, 'YYYY-MM-DD') AS date_iso
  `) as MeetingRow[];
  return rows[0] ? toMeeting(rows[0]) : undefined;
}

/** Deletes one meeting. Returns true when a row was removed. */
export async function deleteMeeting(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`) as { id: number }[];
  return rows.length > 0;
}
