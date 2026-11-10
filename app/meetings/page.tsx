import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import { fetchMeetings } from '@/lib/api';
import { getMostRecentSunday } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'All Meetings',
};

export default async function MeetingsPage() {
  const meetings = await fetchMeetings();
  const currentSunday = getMostRecentSunday();

  return (
    <section aria-labelledby="meetings-heading">
      <h1 id="meetings-heading" className="text-3xl font-semibold">
        Sacrament Meetings
      </h1>
      <p className="mt-2 text-muted">
        Select a Sunday to view the full program. Newest meetings are listed first.
      </p>

      {meetings.length === 0 ? (
        <p className="mt-6">No meetings have been planned yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} isCurrent={meeting.date === currentSunday} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
