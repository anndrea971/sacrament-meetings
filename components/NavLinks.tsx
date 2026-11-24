"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
  /** Only active when the path matches exactly (not for nested routes). */
  exact?: boolean;
}

interface NavLinksProps {
  items: NavItem[];
  ariaLabel: string;
  className?: string;
}

function isActive(pathname: string | null, item: NavItem): boolean {
  if (pathname === null) {
    return false;
  }
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavList({
  items,
  ariaLabel,
  className = "",
  pathname,
}: NavLinksProps & { pathname: string | null }) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex flex-wrap items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "text-brand-dark hover:bg-brand-light"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Reads the current route; must sit under a <Suspense> boundary. */
function ActiveNavList(props: NavLinksProps) {
  const pathname = usePathname();
  return <NavList {...props} pathname={pathname} />;
}

/**
 * Navigation links that highlight the active route.
 * usePathname() is request-time data, so it is wrapped in <Suspense>;
 * the fallback shows the same links without the active highlight.
 */
export default function NavLinks(props: NavLinksProps) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <ActiveNavList {...props} />
    </Suspense>
  );
}
