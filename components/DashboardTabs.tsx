'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/my-courses', label: 'My Courses' },
  { href: '/dashboard/certificates', label: 'Certificates' },
  { href: '/dashboard/profile', label: 'Profile Settings' }
];

export default function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="container-academy pt-10">
      <nav className="flex gap-6 border-b border-academy-100 text-sm">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-3 -mb-px border-b-2 transition-colors ${
                active ? 'border-ink text-ink font-medium' : 'border-transparent text-ink/60 hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
