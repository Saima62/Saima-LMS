import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LearnSidebar from '@/components/learn/LearnSidebar';

export default async function LearnLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('student_id', user.id)
    .eq('course_id', params.courseId)
    .maybeSingle();

  // Not enrolled (or not yet approved) — send them to the course page to enroll instead.
  if (!enrollment || !['active', 'completed'].includes(enrollment.status)) {
    const { data: course } = await supabase.from('courses').select('slug').eq('id', params.courseId).single();
    redirect(course ? `/courses/${course.slug}` : '/courses');
  }

  const { data: course } = await supabase
    .from('courses')
    .select(
      'id, title, modules(id, title, position, lessons(id, title, position), assignments(id, title, position))'
    )
    .eq('id', params.courseId)
    .single();

  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('completed', true);
  const completedLessonIds = (progressRows || []).map((r: any) => r.lesson_id);

  const modules = (course?.modules || [])
    .slice()
    .sort((a: any, b: any) => a.position - b.position)
    .map((m: any) => ({
      ...m,
      lessons: (m.lessons || []).slice().sort((a: any, b: any) => a.position - b.position),
      assignments: (m.assignments || []).slice().sort((a: any, b: any) => a.position - b.position)
    }));

  return (
    <div className="container-academy flex gap-10 items-start">
      <LearnSidebar
        courseId={params.courseId}
        courseTitle={course?.title || 'Course'}
        modules={modules}
        completedLessonIds={completedLessonIds}
      />
      <div className="flex-1 py-10 min-w-0">{children}</div>
    </div>
  );
}
