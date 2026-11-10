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
      { error: 'The date query parameter must use the format YYYY-MM-DD.' },
      { status: 400 },
    );
  }

  const meetings: SacramentMeeting[] = getMeetings(date);
  return Response.json(meetings);
}
