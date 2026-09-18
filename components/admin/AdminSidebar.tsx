'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/enrollments', label: 'Enrollments' },
  { href: '/admin/assignments', label: 'Assignments' },
  { href: '/admin/live-classes', label: 'Live Classes' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/settings', label: 'Settings' }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-academy-100 min-h-screen py-10 pr-6">
      <p className="font-serif text-lg text-ink px-2 mb-8">Admin</p>
      <ul className="space-y-1">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded-sm text-sm transition-colors ${
                  active
                    ? 'bg-academy-50 text-ink font-medium'
                    : 'text-ink/60 hover:bg-academy-50 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-10 px-2">
        <Link href="/dashboard" className="text-xs text-ink/50 underline">
          ← Back to student view
        </Link>
      </div>
    </nav>
  );
}
