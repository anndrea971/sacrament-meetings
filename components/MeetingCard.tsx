import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, formatShortDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS, MEETING_TYPE_STYLES } from './meeting-labels';

interface MeetingCardProps {
  meeting: SacramentMeeting;
  /** Marks the card for the most recent Sunday. */
  isCurrent?: boolean;
}

export default function MeetingCard({ meeting, isCurrent = false }: MeetingCardProps) {
  const short = formatShortDate(meeting.date);
  const speakerCount = meeting.speakers.filter((s) => s.type === 'speaker').length;
  const musicalCount = meeting.speakers.filter((s) => s.type === 'musical-number').length;

  return (
    <article className="relative flex gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm transition-shadow focus-within:shadow-md hover:shadow-md">
      <div
        className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-brand text-white"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-wide">{short.month}</span>
        <span className="font-serif text-2xl font-semibold leading-none">{short.day}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">
            <Link
              href={`/meetings/${meeting.id}`}
              className="after:absolute after:inset-0 hover:underline"
            >
              {formatMeetingDate(meeting.date)}
            </Link>
          </h2>
          {isCurrent && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
              This week
            </span>
          )}
        </div>

        <p className="mt-1">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${MEETING_TYPE_STYLES[meeting.meetingType]}`}
          >
            {MEETING_TYPE_LABELS[meeting.meetingType]}
          </span>
        </p>

        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-0.5 text-sm text-muted sm:grid-cols-2">
          <div>
            <dt className="inline font-medium text-foreground">Presiding: </dt>
            <dd className="inline">{meeting.presiding}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-foreground">Conducting: </dt>
            <dd className="inline">{meeting.conducting}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-foreground">Program: </dt>
            <dd className="inline">
              {speakerCount} {speakerCount === 1 ? 'speaker' : 'speakers'}, {musicalCount}{' '}
              musical {musicalCount === 1 ? 'number' : 'numbers'}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
