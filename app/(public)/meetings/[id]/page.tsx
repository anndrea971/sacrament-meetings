import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';
import PrintButton from '@/components/PrintButton';
import { formatMeetingDate } from '@/lib/dates';
import { getMeetingById } from '@/lib/meetings-db';

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  const { id } = await params;

  // Same rule as the API route: ids are whole numbers.
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/meetings" className="text-sm font-medium text-brand hover:underline">
          &larr; Back to all meetings
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="rounded-md border border-brand px-3 py-1 text-sm font-medium text-brand hover:bg-brand-light"
          >
            Edit
          </Link>
          <DeleteMeetingButton id={meeting.id} label={formatMeetingDate(meeting.date)} />
          <PrintButton />
        </div>
      </div>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}
