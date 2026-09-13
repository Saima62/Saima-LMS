import { createClient } from '@/lib/supabase/server';

// Call at the top of every admin Server Action. Middleware already blocks
// non-admins from loading /admin pages, but Server Actions can in principle
// be invoked directly, so each one re-checks role itself.
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Admin access required');

  return { supabase, userId: user.id };
}
