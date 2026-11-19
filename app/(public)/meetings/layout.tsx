import NavLinks, { type NavItem } from '@/components/NavLinks';

const SECTION_NAV: NavItem[] = [
  { href: '/meetings', label: 'All programs', exact: true },
  { href: '/meetings/current', label: 'This week' },
];

export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
  return (
    <div>
      <NavLinks
        items={SECTION_NAV}
        ariaLabel="Meetings section"
        className="mb-6 border-b border-line pb-3 print:hidden"
      />
      {children}
    </div>
  );
}
