import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Meeting',
  robots: { index: false },
};

async function EditMeetingMessage({ params }: Pick<PageProps<'/meetings/[id]/edit'>, 'params'>) {
  const { id } = await params;
  return <p className="mt-2 text-muted">The edit form for meeting {id} will be added next week.</p>;
}

export default function EditMeetingPage({ params }: PageProps<'/meetings/[id]/edit'>) {
  return (
    <section aria-labelledby="edit-meeting-heading">
      <h1 id="edit-meeting-heading" className="text-3xl font-semibold">
        Edit Meeting &mdash; Coming in Week 04
      </h1>
      <Suspense fallback={<p className="mt-2 text-muted">Loading…</p>}>
        <EditMeetingMessage params={params} />
      </Suspense>
      <Link href="/meetings" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
        &larr; Back to all meetings
      </Link>
    </section>
  );
}
