import { Suspense } from 'react';
import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMostRecentSunday } from '@/lib/dates';
import { MEETINGS_PER_PAGE, getMeetingsPage } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'All Meetings',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

async function MeetingResults({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = firstValue(params.query);
  const requestedPage = Number.parseInt(firstValue(params.page), 10);

  const { meetings, total, totalPages, page } = await getMeetingsPage({
    query,
    page: Number.isNaN(requestedPage) ? 1 : requestedPage,
  });
  const currentSunday = getMostRecentSunday();

  if (meetings.length === 0) {
    return (
      <p role="status" className="mt-6">
        {query ? `No meetings match "${query}".` : 'No meetings have been planned yet.'}
      </p>
    );
  }

  const firstShown = (page - 1) * MEETINGS_PER_PAGE + 1;
  const lastShown = firstShown + meetings.length - 1;

  return (
    <>
      <p role="status" className="mt-4 text-sm text-muted">
        Showing {firstShown}&ndash;{lastShown} of {total} {total === 1 ? 'meeting' : 'meetings'}
        {query ? ` matching "${query}"` : ''}
      </p>
      <ul className="mt-4 space-y-4">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <MeetingCard meeting={meeting} isCurrent={meeting.date === currentSunday} />
          </li>
        ))}
      </ul>
      <Pagination totalPages={totalPages} />
    </>
  );
}

export default function MeetingsPage({ searchParams }: PageProps<'/meetings'>) {
  return (
    <section aria-labelledby="meetings-heading">
      <h1 id="meetings-heading" className="text-3xl font-semibold">
        Sacrament Meetings
      </h1>
      <p className="mt-2 mb-6 text-muted">
        Select a Sunday to view the full program. Newest meetings are listed first.
      </p>

      <Suspense fallback={<div className="h-16" aria-hidden="true" />}>
        <MeetingSearch />
      </Suspense>

      <Suspense fallback={<p className="mt-6 text-muted">Loading meetings…</p>}>
        <MeetingResults searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
