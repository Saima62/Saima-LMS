import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Called once a day by Vercel Cron (see vercel.json). It makes a few small,
// read-only database requests so Supabase's free plan sees regular activity
// and doesn't auto-pause the project after 7 days without visitors.
// It only reads public data (published courses, academy settings, modules) —
// nothing private, nothing is written.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Optional protection: if a CRON_SECRET environment variable is ever set in
  // Vercel, Vercel Cron sends it automatically and anyone else is refused.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  const [courses, settings, modules] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('academy_settings').select('id').eq('id', 1).maybeSingle(),
    supabase.from('modules').select('id', { count: 'exact', head: true })
  ]);

  const firstError = courses.error || settings.error || modules.error;
  if (firstError) {
    // A failure shows up in the Vercel cron logs, so a paused/unreachable
    // database is easy to spot.
    return NextResponse.json({ ok: false, error: firstError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    publishedCourses: courses.count ?? 0,
    checkedAt: new Date().toISOString()
  });
}
