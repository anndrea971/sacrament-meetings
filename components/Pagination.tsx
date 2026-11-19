'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

const LINK_BASE = 'inline-block min-w-10 rounded-md border px-3 py-2 text-center text-sm font-medium';
const LINK_IDLE = 'border-line bg-surface text-brand-dark hover:bg-brand-light';
const LINK_ACTIVE = 'border-brand bg-brand text-white';
const LINK_DISABLED = 'cursor-not-allowed border-line bg-surface text-muted opacity-60';

/**
 * Previous / next / page-number links. The current page comes from the URL,
 * and every link keeps the active search term.
 */
export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const requested = Number(searchParams.get('page'));
  const currentPage = Math.min(Math.max(Number.isInteger(requested) ? requested : 1, 1), totalPages);

  function hrefFor(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  const first = Math.max(1, currentPage - 2);
  const last = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];
  for (let page = first; page <= last; page += 1) {
    pages.push(page);
  }

  return (
    <nav aria-label="Pagination" className="mt-6 print:hidden">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {currentPage > 1 ? (
            <Link href={hrefFor(currentPage - 1)} className={`${LINK_BASE} ${LINK_IDLE}`}>
              <span aria-hidden="true">&larr; </span>Previous
            </Link>
          ) : (
            <span aria-disabled="true" className={`${LINK_BASE} ${LINK_DISABLED}`}>
              <span aria-hidden="true">&larr; </span>Previous
            </span>
          )}
        </li>

        {pages.map((page) => (
          <li key={page}>
            <Link
              href={hrefFor(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`${LINK_BASE} ${page === currentPage ? LINK_ACTIVE : LINK_IDLE}`}
            >
              {page}
            </Link>
          </li>
        ))}

        <li>
          {currentPage < totalPages ? (
            <Link href={hrefFor(currentPage + 1)} className={`${LINK_BASE} ${LINK_IDLE}`}>
              Next<span aria-hidden="true"> &rarr;</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={`${LINK_BASE} ${LINK_DISABLED}`}>
              Next<span aria-hidden="true"> &rarr;</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
