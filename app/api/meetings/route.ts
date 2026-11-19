import type { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import { isIsoDate } from '@/lib/dates';
import type { SacramentMeeting } from '@/lib/types';

// GET /api/meetings
// GET /api/meetings?date=2026-11-08
export async function GET(request: NextRequest): Promise<Response> {
  const date = request.nextUrl.searchParams.get('date') ?? undefined;

  if (date !== undefined && !isIsoDate(date)) {
    return Response.json(
      { error: 'The date query parameter must be a real date in the format YYYY-MM-DD.' },
      { status: 400 },
    );
  }

  try {
    const meetings: SacramentMeeting[] = await getMeetings(date);
    return Response.json(meetings);
  } catch (error) {
    console.error('GET /api/meetings failed', error);
    return Response.json({ error: 'Could not load meetings.' }, { status: 500 });
  }
}
