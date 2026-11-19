'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Search box whose state lives in the URL (?query=...).
 * Typing waits 300 ms before updating the URL, so we don't query the
 * database on every keystroke. A new search always goes back to page 1.
 */
export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (term.trim() === '') {
      params.delete('query');
    } else {
      params.set('query', term);
    }

    const queryString = params.toString();
    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, 300);

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className="max-w-md">
      <label htmlFor="meeting-search" className="mb-1 block text-sm font-medium">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        name="query"
        aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
        placeholder="Speaker, presiding, conducting, or type"
        defaultValue={searchParams.get('query') ?? ''}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-md border border-line bg-surface px-3 py-2 text-base"
      />
    </form>
  );
}
