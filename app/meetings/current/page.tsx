import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { fetchMeetingByDate } from '@/lib/api';
import { getMostRecentSunday } from '@/lib/dates';

// Sends the visitor to the program for the most recent Sunday.
// If that Sunday has not been planned yet, fall back to the full list.
export default async function CurrentMeetingPage() {
  // "Most recent Sunday" depends on today's date, so wait for a real request.
  await connection();

  const meeting = await fetchMeetingByDate(getMostRecentSunday());

  if (meeting) {
    redirect(`/meetings/${meeting.id}`);
  }
  redirect('/meetings');
}
