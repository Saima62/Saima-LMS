import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardTabs from '@/components/DashboardTabs';

// Explicit result shapes for the joined ("embedded") queries below. Without
// generated Database types supabase-js types embedded relations as arrays, so
// each query is paired with .returns<T>() to give it its real shape.
type LessonRef = { id: string; title: string; position: number };
type AssignmentRef = { id: string; title: string; due_date: string | null };
type ModuleRef = { position: number; lessons: LessonRef[]; assignments: AssignmentRef[] };
type CourseRef = { id: string; title: string; slug: string; modules: ModuleRef[] };
type EnrollmentRow = { id: string; status: string; course: CourseRef | null };
type PendingEnrollmentRow = { id: string; status: string; course: { title: string } | null };
type QuizAttemptRow = {
  id: string;
  score: number;
  passed: boolean;
  attempted_at: string;
  quiz: { title: string };
};
type UpcomingClass = {
  title: string;
  class_date: string;
  class_time: string;
  meeting_link: string;
  course_id: string;
};
type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  course: { title: string } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Middleware already keeps logged-out visitors out of /dashboard; this is a
  // second safety net so a missing session redirects instead of crashing.
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle();

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(
      'id, status, course:courses(id, title, slug, modules(position, lessons(id, title, position), assignments(id, title, due_date)))'
    )
    .eq('student_id', user.id)
    .in('status', ['active', 'completed'])
    .order('enrolled_at', { ascending: false })
    .returns<EnrollmentRow[]>();

  const { data: waitingEnrollments } = await supabase
    .from('enrollments')
    .select('id, status, course:courses(title)')
    .eq('student_id', user.id)
    .in('status', ['pending_payment', 'rejected'])
    .returns<PendingEnrollmentRow[]>();

  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('completed', true);
  const completedLessonIds = new Set((progressRows || []).map((r) => r.lesson_id));

  // A course can come back null (e.g. it was later unpublished, so Row Level
  // Security hides it). Filter those out first; the type predicate tells
  // TypeScript "course" is present on what remains.
  const courses = (enrollments || [])
    .filter((e): e is EnrollmentRow & { course: CourseRef } => e.course !== null)
    .map((e) => {
      const modules = [...(e.course.modules || [])].sort((a, b) => a.position - b.position);
      const orderedLessons = modules.flatMap((m) =>
        [...(m.lessons || [])].sort((a, b) => a.position - b.position)
      );
      const done = orderedLessons.filter((l) => completedLessonIds.has(l.id)).length;
      const nextLesson = orderedLessons.find((l) => !completedLessonIds.has(l.id)) || null;
      const assignments = modules.flatMap((m) => m.assignments || []);
      return {
        id: e.course.id,
        title: e.course.title,
        status: e.status,
        totalLessons: orderedLessons.length,
        doneLessons: done,
        percent: orderedLessons.length > 0 ? Math.round((done / orderedLessons.length) * 100) : 0,
        nextLesson,
        assignments
      };
    });

  const courseIds = courses.map((c) => c.id);
  const continueCourse = courses.find((c) => c.nextLesson !== null) || null;

  // Assignments the student has not submitted yet
  const { data: submissionRows } = await supabase
    .from('assignment_submissions')
    .select('assignment_id')
    .eq('student_id', user.id);
  const submittedIds = new Set((submissionRows || []).map((s) => s.assignment_id));
  const pendingAssignments = courses
    .flatMap((c) =>
      c.assignments
        .filter((a) => !submittedIds.has(a.id))
        .map((a) => ({ ...a, courseId: c.id, courseTitle: c.title }))
    )
    .slice(0, 5);

  // Quiz results
  const { data: recentAttempts } = await supabase
    .from('quiz_attempts')
    .select('id, score, passed, attempted_at, quiz:quizzes!inner(title)')
    .eq('student_id', user.id)
    .order('attempted_at', { ascending: false })
    .limit(5)
    .returns<QuizAttemptRow[]>();

  const { data: allScores } = await supabase
    .from('quiz_attempts')
    .select('score')
    .eq('student_id', user.id)
    .limit(200);
  const averageScore =
    allScores && allScores.length > 0
      ? Math.round(allScores.reduce((sum, r) => sum + (r.score || 0), 0) / allScores.length)
      : null;

  // Live classes
  const { data: upcomingClasses } = await supabase
    .from('live_classes')
    .select('title, class_date, class_time, meeting_link, course_id')
    .in('course_id', courseIds.length ? courseIds : ['00000000-0000-0000-0000-000000000000'])
    .gte('class_date', new Date().toISOString().split('T')[0])
    .order('class_date', { ascending: true })
    .limit(3)
    .returns<UpcomingClass[]>();

  const { data: certificates } = await supabase.from('certificates').select('id').eq('student_id', user.id);

  // Teacher announcements (Row Level Security only returns the ones this
  // student is allowed to see: "everyone" plus their own courses)
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, body, created_at, course:courses(title)')
    .order('created_at', { ascending: false })
    .limit(3)
    .returns<AnnouncementRow[]>();

  const lessonsCompleted = courses.reduce((sum, c) => sum + c.doneLessons, 0);

  const stats = [
    { label: 'Courses enrolled', value: String(courses.length) },
    { label: 'Lessons completed', value: String(lessonsCompleted) },
    { label: 'Average quiz score', value: averageScore === null ? '—' : `${averageScore}%` },
    { label: 'Certificates', value: String(certificates?.length || 0) }
  ];

  return (
    <>
      <DashboardTabs />
      <div className="container-academy py-10">
        <h1 className="font-serif text-3xl text-ink mb-1">Welcome back, {profile?.full_name || 'Student'}!</h1>
        <p className="text-ink/60 mb-8 text-sm">Here's where you left off.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="border border-academy-100 bg-white rounded-sm p-5">
              <p className="font-serif text-3xl text-ink">{s.value}</p>
              <p className="text-xs text-ink/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {continueCourse && continueCourse.nextLesson && (
          <div className="border border-gold/40 bg-academy-50 rounded-sm p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Continue learning</p>
              <p className="font-serif text-xl text-ink">{continueCourse.nextLesson.title}</p>
              <p className="text-sm text-ink/60">{continueCourse.title}</p>
            </div>
            <Link
              href={`/learn/${continueCourse.id}/lessons/${continueCourse.nextLesson.id}`}
              className="bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-academy-700 text-sm"
            >
              Resume lesson
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-10">
            <section className="space-y-4">
              <h2 className="font-serif text-xl text-ink">My Courses</h2>
              {courses.length === 0 && (
                <p className="text-sm text-ink/60">
                  You haven't enrolled in a course yet.{' '}
                  <Link href="/courses" className="underline">
                    Browse courses
                  </Link>
                  .
                </p>
              )}
              {courses.map((c) => (
                <div key={c.id} className="border border-academy-100 rounded-sm p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-ink">{c.title}</p>
                    <span className="text-sm text-ink/60">
                      {c.status === 'completed' ? 'Completed' : `${c.percent}% complete`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-academy-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gold" style={{ width: `${c.percent}%` }} />
                  </div>
                  <p className="text-xs text-ink/50 mb-4">
                    {c.doneLessons} of {c.totalLessons} lessons done
                  </p>
                  <Link href={`/learn/${c.id}`} className="text-sm text-ink underline">
                    {c.percent === 100 ? 'Review course' : 'Continue learning'}
                  </Link>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-xl text-ink">Pending assignments</h2>
              {pendingAssignments.length === 0 ? (
                <p className="text-sm text-ink/60">Nothing pending right now.</p>
              ) : (
                pendingAssignments.map((a) => (
                  <Link
                    key={a.id}
                    href={`/learn/${a.courseId}/assignments/${a.id}`}
                    className="block border border-academy-100 rounded-sm p-4 bg-white hover:border-gold transition-colors"
                  >
                    <p className="text-ink text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-ink/50">
                      {a.courseTitle}
                      {a.due_date ? ` · due ${new Date(a.due_date).toLocaleDateString()}` : ''}
                    </p>
                  </Link>
                ))
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="border border-academy-100 rounded-sm p-5 bg-white">
              <p className="font-medium text-ink mb-3">Announcements</p>
              {announcements && announcements.length > 0 ? (
                announcements.map((a) => (
                  <div key={a.id} className="mb-4 last:mb-0">
                    <p className="text-sm text-ink">{a.title}</p>
                    <p className="text-xs text-ink/50 mb-1">
                      {new Date(a.created_at).toLocaleDateString()}
                      {a.course ? ` · ${a.course.title}` : ''}
                    </p>
                    <p className="text-sm text-ink/70 whitespace-pre-wrap">{a.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/60">No announcements yet.</p>
              )}
            </div>

            <div className="border border-academy-100 rounded-sm p-5 bg-white">
              <p className="font-medium text-ink mb-3">Upcoming live classes</p>
              {upcomingClasses && upcomingClasses.length > 0 ? (
                upcomingClasses.map((c, i) => (
                  <div key={i} className="text-sm text-ink/70 mb-3 last:mb-0">
                    <p className="text-ink">{c.title}</p>
                    <p>
                      {c.class_date} — {c.class_time}
                    </p>
                    {/^https?:\/\//i.test(c.meeting_link) && (
                      <a
                        href={c.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-ink"
                      >
                        Join class
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/60">No upcoming classes scheduled.</p>
              )}
            </div>

            <div className="border border-academy-100 rounded-sm p-5 bg-white">
              <p className="font-medium text-ink mb-3">Recent quiz results</p>
              {recentAttempts && recentAttempts.length > 0 ? (
                recentAttempts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm mb-2 last:mb-0">
                    <span className="text-ink/80 pr-3">{a.quiz.title}</span>
                    <span className={a.passed ? 'text-academy-600' : 'text-ink/60'}>
                      {a.score}% {a.passed ? '✓' : ''}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/60">No quizzes attempted yet.</p>
              )}
            </div>

            {waitingEnrollments && waitingEnrollments.length > 0 && (
              <div className="border border-academy-100 rounded-sm p-5 bg-white">
                <p className="font-medium text-ink mb-3">Enrollment status</p>
                {waitingEnrollments.map((w) => (
                  <p key={w.id} className="text-sm text-ink/70 mb-2 last:mb-0">
                    {w.course?.title || 'Course'} —{' '}
                    {w.status === 'pending_payment' ? 'waiting for payment approval' : 'not approved'}
                  </p>
                ))}
              </div>
            )}

            <div className="border border-academy-100 rounded-sm p-5 bg-white">
              <p className="font-medium text-ink mb-3">Certificates earned</p>
              <p className="text-sm text-ink/70 mb-1">{certificates?.length || 0}</p>
              <Link href="/dashboard/certificates" className="text-sm underline">
                View certificates
              </Link>
            </div>

            <div className="border border-academy-100 rounded-sm p-5 bg-white">
              <p className="font-medium text-ink mb-2">Need help?</p>
              <p className="text-sm text-ink/70 mb-2">Questions about a lesson, payment or a live class?</p>
              <Link href="/contact" className="text-sm underline">
                Contact your instructor
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
