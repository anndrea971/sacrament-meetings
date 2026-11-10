import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="rounded-xl border border-line bg-surface p-8 text-center">
      <h1 className="text-2xl font-semibold">Meeting not found</h1>
      <p className="mt-2 text-muted">
        We couldn&rsquo;t find a program with that ID. It may have been removed or the link may be
        incorrect.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-block rounded-md bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
      >
        View all meetings
      </Link>
    </div>
  );
}
