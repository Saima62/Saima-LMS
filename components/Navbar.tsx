import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/LogoutButton';

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-academy-100 bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="container-academy flex items-center justify-between h-20">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-xl text-ink">Saima Perveen</span>
          <span className="text-xs tracking-wide text-academy-600">English Academy</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ink/80">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-ink/80 hover:text-ink">
                Dashboard
              </Link>
              <LogoutButton className="text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 transition-colors" />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-ink/80 hover:text-ink">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 transition-colors"
              >
                Start learning
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
