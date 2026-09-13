import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// SERVICE ROLE client — bypasses Row Level Security entirely.
// Only ever import this inside Server Components / Server Actions that
// have already confirmed the caller is an admin (the /admin route group
// is protected by middleware.ts). NEVER import this in a Client Component
// and NEVER send this key to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
