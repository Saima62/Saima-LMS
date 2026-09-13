import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardTabs from '@/components/DashboardTabs';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Belt-and-braces: middleware already keeps logged-out visitors out of
  // /dashboard, but if it's ever bypassed we redirect instead of crashing.
  if (!user) {
    redirect('/login');
  }

  // Explicit types for the joined ("embedded") query results below. Without
  // generated Database types, supabase-js can't know these are one-to-one
  // relationships (courses.modules, enrollments.course) from the FK schema
  // alone, so it defaults to typing them as arrays — these interfaces (paired
  // with .returns<T>() on each query) give the accurate shape instead.
  type LessonRef = { id: string };
  type ModuleRef = { lessons: LessonRef[] };
  type CourseRef = { id: string; title: string; slug: string; modules: ModuleRef[] };
  type EnrollmentRow = { id: string; status: string; course: CourseRef | null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, status, course:courses(id, title, slug, modules(lessons(id)))')
    .eq('student_id', user.id)
    .in('status', ['active', 'completed'])
    .returns<EnrollmentRow[]>();

  // Progress per course = completed lessons / total lessons
  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('completed', true);
  const completedLessonIds = new Set((progressRows || []).map((r) => r.lesson_id));

  // e.course can come back null — e.g. the course was later unpublished, so
  // Row Level Security hides that joined row instead of returning it (the
  // enrollment itself isn't deleted). Filter those out before touching
  // e.course.modules below, using a type predicate so TypeScript knows
  // "course" is no longer null on the rows that remain — no "any" needed.
  const coursesWithProgress = (enrollments || [])
    .filter((e): e is EnrollmentRow & { course: CourseRef } => e.course !== null)
    .map((e) => {
      const allLessons = e.course.modules.flatMap((m) => m.lessons);
      const total = allLessons.length;
      const done = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
      return {
        ...e.course,
        percent: total > 0 ? Math.round((done / total) * 100) : 0
      };
    });

  // supabase-js infers the shape of embedded relations (like quiz:quizzes(...))
  // straight from this select() string, at the type level. Without generated
  // Database types telling it that quiz_attempts.quiz_id is a NOT NULL foreign
  // key (a one-to-one relationship), it conservatively types "quiz" as an
  // array. Adding "!inner" tells it this is a to-one join — which it actually
  // is, since quiz_id is defined "not null" in supabase/schema.sql — and
  // .returns<T>() then gives the query its correct, exact type instead of
  // that inferred array shape.
  type RecentQuizAttempt = {
    score: number;
    attempted_at: string;
    quiz: { title: string };
  };

  const { data: recentQuiz } = await supabase
    .from('quiz_attempts')
    .select('score, attempted_at, quiz:quizzes!inner(title)')
    .eq('student_id', user.id)
    .order('attempted_at', { ascending: false })
    .limit(1)
    .maybeSingle()
    .returns<RecentQuizAttempt>();

  const courseIds = coursesWithProgress.map((c) => c.id);
  type UpcomingClass = {
    title: string;
    class_date: string;
    class_time: string;
    meeting_link: string;
    course_id: string;
  };
  const { data: upcomingClasses } = await supabase
    .from('live_classes')
    .select('title, class_date, class_time, meeting_link, course_id')
    .in('course_id', courseIds.length ? courseIds : ['00000000-0000-0000-0000-000000000000'])
    .gte('class_date', new Date().toISOString().split('T')[0])
    .order('class_date', { ascending: true })
    .limit(3)
    .returns<UpcomingClass[]>();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('id')
    .eq('student_id', user.id);

  return (
    <>
      <DashboardTabs />
      <div className="container-academy py-10">
      <h1 className="font-serif text-3xl text-ink mb-1">Welcome back, {profile?.full_name || 'Student'}!</h1>
      <p className="text-ink/60 mb-10 text-sm">Here's where you left off.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-4">
          <h2 className="font-serif text-xl text-ink">My Courses</h2>
          {coursesWithProgress.length === 0 && (
            <p className="text-sm text-ink/60">
              You haven't enrolled in a course yet. <Link href="/courses" className="underline">Browse courses</Link>.
            </p>
          )}
          {coursesWithProgress.map((c) => (
            <div key={c.id} className="border border-academy-100 rounded-sm p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-ink">{c.title}</p>
                <span className="text-sm text-ink/60">{c.percent}% complete</span>
              </div>
              <div className="w-full h-2 bg-academy-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gold" style={{ width: `${c.percent}%` }} />
              </div>
              <Link href={`/learn/${c.id}`} className="text-sm text-ink underline">
                Continue learning
              </Link>
            </div>
          ))}
        </section>

        <aside className="space-y-6">
          <div className="border border-academy-100 rounded-sm p-5 bg-white">
            <p className="font-medium text-ink mb-3">Upcoming class</p>
            {upcomingClasses && upcomingClasses.length > 0 ? (
              upcomingClasses.map((c, i) => (
                <div key={i} className="text-sm text-ink/70 mb-2">
                  <p className="text-ink">{c.title}</p>
                  <p>{c.class_date} — {c.class_time}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/60">No upcoming classes scheduled.</p>
            )}
          </div>

          <div className="border border-academy-100 rounded-sm p-5 bg-white">
            <p className="font-medium text-ink mb-3">Recent quiz</p>
            {recentQuiz ? (
              <p className="text-sm text-ink/70">{recentQuiz.quiz.title} — {recentQuiz.score}%</p>
            ) : (
              <p className="text-sm text-ink/60">No quizzes attempted yet.</p>
            )}
          </div>

          <div className="border border-academy-100 rounded-sm p-5 bg-white">
            <p className="font-medium text-ink mb-3">Certificates earned</p>
            <p className="text-sm text-ink/70">{certificates?.length || 0}</p>
            <Link href="/dashboard/certificates" className="text-sm underline">View certificates</Link>
          </div>
        </aside>
      </div>
      </div>
    </>
  );
}
