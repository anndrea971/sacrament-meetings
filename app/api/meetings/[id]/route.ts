import type { NextRequest } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

// GET /api/meetings/[id]
//   200 -> the meeting
//   400 -> id is not a valid number
//   404 -> no meeting with that id
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<'/api/meetings/[id]'>,
): Promise<Response> {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return Response.json({ error: 'Meeting id must be a valid number.' }, { status: 400 });
  }

  const meeting = getMeetingById(Number(id));

  if (!meeting) {
    return Response.json({ error: `No meeting found with id ${id}.` }, { status: 404 });
  }

  return Response.json(meeting);
}
