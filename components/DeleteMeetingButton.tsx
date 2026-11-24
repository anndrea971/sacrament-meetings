'use client';

import { useActionState } from 'react';
import { deleteMeeting } from '@/lib/actions';

interface DeleteMeetingButtonProps {
  id: number;
  /** Used in the accessible name, e.g. "Sunday, November 8, 2026". */
  label: string;
}

export default function DeleteMeetingButton({ id, label }: DeleteMeetingButtonProps) {
  const [, formAction, isPending] = useActionState(deleteMeeting.bind(null, id), undefined);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting for ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        disabled={isPending}
        aria-label={`Delete meeting for ${label}`}
        className="rounded-md border border-red-700 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Deleting…' : 'Delete'}
      </button>
    </form>
  );
}
