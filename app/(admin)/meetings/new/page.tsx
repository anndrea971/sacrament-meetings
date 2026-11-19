import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Meeting',
  robots: { index: false },
};

export default function NewMeetingPage() {
  return (
    <section aria-labelledby="new-meeting-heading">
      <h1 id="new-meeting-heading" className="text-3xl font-semibold">
        Create Meeting &mdash; Coming in Week 04
      </h1>
      <p className="mt-2 text-muted">The form for planning a new meeting will be added next week.</p>
      <Link href="/meetings" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
        &larr; Back to all meetings
      </Link>
    </section>
  );
}
