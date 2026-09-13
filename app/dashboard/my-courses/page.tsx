import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardTabs from '@/components/DashboardTabs';

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, status, course:courses(id, title, slug, cover_image_url, modules(lessons(id)))')
    .eq('student_id', user.id)
    .order('enrolled_at', { ascending: false });

  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('completed', true);
  const completedLessonIds = new Set((progressRows || []).map((r: any) => r.lesson_id));

  const rows = (enrollments || []).map((e: any) => {
    // e.course can be null if that course was unpublished/removed after
    // enrolling — RLS hides it instead of returning it. Show a fallback
    // instead of crashing on e.course.title/.modules below.
    if (!e.course) {
      return {
        enrollmentId: e.id,
        status: e.status,
        course: { id: null, title: 'This course is no longer available' },
        percent: 0,
        unavailable: true
      };
    }
    const allLessons = (e.course.modules || []).flatMap((m: any) => m.lessons || []);
    const total = allLessons.length;
    const done = allLessons.filter((l: any) => completedLessonIds.has(l.id)).length;
    return {
      enrollmentId: e.id,
      status: e.status,
      course: e.course,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
      unavailable: false
    };
  });

  const statusLabel: Record<string, string> = {
    active: 'In progress',
    completed: 'Completed',
    pending_payment: 'Awaiting payment approval',
    rejected: 'Payment not approved'
  };

  return (
    <>
      <DashboardTabs />
      <div className="container-academy py-10">
      <h1 className="font-serif text-3xl text-ink mb-1">My Courses</h1>
      <p className="text-ink/60 mb-10">Everything you're enrolled in, in one place.</p>

      {rows.length === 0 && (
        <div className="border border-academy-100 bg-white rounded-sm p-10 text-center">
          <p className="text-ink/70 mb-4">You haven't enrolled in a course yet.</p>
          <Link href="/courses" className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm inline-block">
            Browse courses
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {rows.map((r) => (
          <div key={r.enrollmentId} className="border border-academy-100 bg-white rounded-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="font-serif text-lg text-ink">{r.course.title}</p>
              <span className="text-xs text-ink/50 shrink-0 ml-3">{statusLabel[r.status] || r.status}</span>
            </div>

            {(r.status === 'active' || r.status === 'completed') && !r.unavailable && (
              <>
                <div className="w-full h-2 bg-academy-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gold" style={{ width: `${r.percent}%` }} />
                </div>
                <p className="text-sm text-ink/60 mb-4">{r.percent}% complete</p>
                <Link href={`/learn/${r.course.id}`} className="text-sm bg-ink text-paper px-4 py-2 rounded-sm inline-block">
                  Continue learning
                </Link>
              </>
            )}

            {r.unavailable && (
              <p className="text-sm text-ink/60">
                This course isn't available right now. Please{' '}
                <Link href="/contact" className="underline">contact us</Link> if you think this is a mistake.
              </p>
            )}

            {r.status === 'pending_payment' && (
              <p className="text-sm text-ink/60">
                We're reviewing your payment reference. You'll get access as soon as it's approved.
              </p>
            )}

            {r.status === 'rejected' && (
              <p className="text-sm text-ink/60">
                Your payment reference couldn't be confirmed. Please{' '}
                <Link href="/contact" className="underline">contact us</Link> to sort this out.
              </p>
            )}
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
