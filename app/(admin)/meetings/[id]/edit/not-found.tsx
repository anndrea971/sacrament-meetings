import Link from 'next/link';

export default function EditMeetingNotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="py-8">
      <h1 id="not-found-heading" className="text-3xl font-semibold">
        Meeting not found
      </h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t find the meeting you wanted to edit. It may have been deleted, or the link may be wrong.
      </p>
      <Link href="/meetings" className="mt-4 inline-block font-medium text-brand hover:underline">
        &larr; Back to all meetings
      </Link>
    </section>
  );
}
