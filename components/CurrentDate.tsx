import { connection } from 'next/server';

/**
 * Today's date, rendered at request time.
 *
 * `new Date()` changes on every request, so it can't be prerendered.
 * Awaiting connection() defers this component until a real request arrives;
 * the parent wraps it in <Suspense> so the rest of the layout stays static.
 */
export default async function CurrentDate() {
  await connection();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <span className="sr-only">Today is </span>
      {today}
    </>
  );
}
