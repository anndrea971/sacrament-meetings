import type { ReactNode } from 'react';
import type { Hymn, SacramentMeeting } from '@/lib/types';
import { formatMeetingDate } from '@/lib/dates';
import { MEETING_TYPE_LABELS, MEETING_TYPE_STYLES, hasSacrament } from './meeting-labels';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="break-inside-avoid border-t border-line py-4 first:border-t-0">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function HymnLine({ hymn }: { hymn: Hymn }) {
  return (
    <p>
      <span className="font-medium">#{hymn.number}</span> &ndash; {hymn.title}
    </p>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const sacrament = hasSacrament(meeting.meetingType);
  const announcements = meeting.announcements ?? [];

  return (
    <div className="rounded-xl border border-line bg-surface p-6 shadow-sm print:border-0 print:p-0 print:shadow-none">
      <header className="mb-4">
        <p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${MEETING_TYPE_STYLES[meeting.meetingType]}`}
          >
            {MEETING_TYPE_LABELS[meeting.meetingType]}
          </span>
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          {formatMeetingDate(meeting.date)}
        </h1>
        <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          <div>
            <dt className="inline font-medium">Presiding: </dt>
            <dd className="inline text-muted">{meeting.presiding}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Conducting: </dt>
            <dd className="inline text-muted">{meeting.conducting}</dd>
          </div>
        </dl>
        {!sacrament && (
          <p className="mt-3 rounded-md bg-brand-light px-3 py-2 text-sm text-brand-dark">
            This is a non-sacrament meeting. The sacrament is not administered today.
          </p>
        )}
      </header>

      <Section title="Announcements">
        {announcements.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5">
            {announcements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No announcements.</p>
        )}
      </Section>

      <Section title="Opening Hymn">
        <HymnLine hymn={meeting.openingHymn} />
      </Section>

      <Section title="Opening Prayer">
        <p>{meeting.openingPrayer}</p>
      </Section>

      <Section title="Ward Business">
        {meeting.wardBusiness.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5">
            {meeting.wardBusiness.map((item) => (
              <li key={item.description}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No ward business.</p>
        )}
        <p className="mt-2 text-sm">
          <span className="font-medium">Stake business: </span>
          <span className="text-muted">{meeting.stakeBusiness ? 'Yes' : 'No'}</span>
        </p>
      </Section>

      {sacrament && (
        <Section title="Sacrament Hymn">
          <HymnLine hymn={meeting.sacramentHymn} />
        </Section>
      )}

      <Section title="Speakers and Musical Numbers">
        {meeting.speakers.length > 0 ? (
          <ol className="space-y-2">
            {meeting.speakers.map((item) => (
              <li key={`${item.type}-${item.name}`}>
                <p className="font-medium">
                  {item.name}
                  <span className="ml-2 text-xs font-normal uppercase tracking-wide text-accent">
                    {item.type === 'musical-number' ? 'Musical number' : 'Speaker'}
                  </span>
                </p>
                <p className="text-sm text-muted">{item.topic}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted">No speakers or musical numbers.</p>
        )}
      </Section>

      <Section title="Closing Hymn">
        <HymnLine hymn={meeting.closingHymn} />
      </Section>

      <Section title="Closing Prayer">
        <p>{meeting.closingPrayer}</p>
      </Section>
    </div>
  );
}
