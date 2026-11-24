'use client';

import MeetingsError from '@/components/MeetingsError';

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <MeetingsError {...props} />;
}
