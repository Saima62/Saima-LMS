import { NextRequest, NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// This is the page the "Confirm your email" link in Supabase's signup email
// should point to (see README for the exact Supabase Email Template change
// needed) — instead of the old default, which sends the click straight to
// Supabase's own API and shows raw JSON if the link is expired or was
// already used (a very common case: many email apps "pre-visit" links to
// scan them for safety, which silently uses up the link before the student
// ever clicks it themselves).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Confirmed — send them straight into the app.
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Expired, already used, or malformed — land on a friendly page with a
  // one-click way to get a new email, instead of raw Supabase JSON.
  return NextResponse.redirect(`${origin}/login?confirm=expired`);
}
