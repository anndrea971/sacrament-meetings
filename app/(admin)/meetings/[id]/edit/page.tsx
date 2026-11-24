import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { meetingToFormValues } from '@/lib/meeting-form';
import { getMeetingById } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Edit Meeting',
  robots: { index: false },
};

async function EditMeetingForm({ params }: Pick<PageProps<'/meetings/[id]/edit'>, 'params'>) {
  const { id } = await params;

  // Same rule as the rest of the app: ids are whole numbers.
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));
  if (!meeting) {
    notFound();
  }

  return (
    <MeetingForm
      action={updateMeeting.bind(null, meeting.id)}
      initialValues={meetingToFormValues(meeting)}
      submitLabel="Save changes"
    />
  );
}

export default function EditMeetingPage({ params }: PageProps<'/meetings/[id]/edit'>) {
  return (
    <section aria-labelledby="edit-meeting-heading">
      <Link href="/meetings" className="text-sm font-medium text-brand hover:underline">
        &larr; Back to all meetings
      </Link>
      <h1 id="edit-meeting-heading" className="mt-2 mb-6 text-3xl font-semibold">
        Edit Meeting
      </h1>
      <Suspense fallback={<p className="text-muted">Loading meeting…</p>}>
        <EditMeetingForm params={params} />
      </Suspense>
    </section>
  );
}
