'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Shared body for the error.tsx boundaries of the public and admin meeting routes. */
export default function MeetingsError({ error, reset }: MeetingsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" aria-labelledby="error-heading" className="py-8">
      <h1 id="error-heading" className="text-3xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t complete that request. Your data has not been lost. Please try again.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark"
        >
          Try Again
        </button>
        <Link href="/meetings" className="font-medium text-brand hover:underline">
          Back to all meetings
        </Link>
      </div>
    </section>
  );
}
