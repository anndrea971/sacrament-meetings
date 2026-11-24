import type { Metadata } from 'next';
import Link from 'next/link';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';
import { emptyFormValues } from '@/lib/meeting-form';

export const metadata: Metadata = {
  title: 'Create Meeting',
  robots: { index: false },
};

export default function NewMeetingPage() {
  return (
    <section aria-labelledby="new-meeting-heading">
      <Link href="/meetings" className="text-sm font-medium text-brand hover:underline">
        &larr; Back to all meetings
      </Link>
      <h1 id="new-meeting-heading" className="mt-2 mb-6 text-3xl font-semibold">
        Create Meeting
      </h1>
      <MeetingForm action={createMeeting} initialValues={emptyFormValues()} submitLabel="Create meeting" />
    </section>
  );
}
