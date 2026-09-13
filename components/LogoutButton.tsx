'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton({ className }: { className?: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    // Full refresh (not just router.push) so the server-rendered Navbar and
    // any cached dashboard data clear along with the session.
    router.push('/');
    router.refresh();
  }

  return (
    <button onClick={handleLogout} disabled={loading} className={className}>
      {loading ? 'Logging out…' : 'Log out'}
    </button>
  );
}
