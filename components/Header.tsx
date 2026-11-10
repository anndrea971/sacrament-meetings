import { Suspense } from 'react';
import Link from 'next/link';
import NavLinks, { type NavItem } from './NavLinks';
import CurrentDate from './CurrentDate';

const WARD_NAME = 'Maple Grove Ward';

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', exact: true },
  { href: '/meetings', label: 'Meetings' },
];

export default function Header() {
  return (
    <header className="border-b border-line bg-surface print:hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Link href="/" className="font-serif text-xl font-semibold text-brand-dark">
            {WARD_NAME}
          </Link>
          <p className="min-h-6 text-sm text-muted">
            <Suspense fallback={<span aria-hidden="true">&nbsp;</span>}>
              <CurrentDate />
            </Suspense>
          </p>
        </div>
        <NavLinks items={NAV_ITEMS} ariaLabel="Main navigation" />
      </div>
    </header>
  );
}
