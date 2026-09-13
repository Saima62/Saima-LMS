import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function CourseOverviewPage({
  params: paramsPromise
}: {
  params: Promise<{ courseId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from('courses')
    .select('title, short_description, modules(id, position, lessons(id, title, position))')
    .eq('id', params.courseId)
    .single();

  const { data: progressRows } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user!.id)
    .eq('completed', true);
  const completedLessonIds = new Set((progressRows || []).map((r: any) => r.lesson_id));

  const orderedLessons = (course?.modules || [])
    .slice()
    .sort((a: any, b: any) => a.position - b.position)
    .flatMap((m: any) => m.lessons.slice().sort((a: any, b: any) => a.position - b.position));

  const nextLesson = orderedLessons.find((l: any) => !completedLessonIds.has(l.id)) || orderedLessons[0];
  const allDone = orderedLessons.length > 0 && orderedLessons.every((l: any) => completedLessonIds.has(l.id));

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-2">{course?.title}</h1>
      {course?.short_description && <p className="text-ink/60 mb-8">{course.short_description}</p>}

      {allDone ? (
        <div className="border border-gold/40 bg-academy-50 rounded-sm p-6">
          <p className="font-medium text-ink mb-1">You've completed every lesson in this course.</p>
          <p className="text-sm text-ink/70 mb-4">Your certificate will appear on your dashboard once it's issued.</p>
          <Link href="/dashboard/certificates" className="text-sm underline">View certificates</Link>
        </div>
      ) : nextLesson ? (
        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="text-sm text-ink/60 mb-1">Pick up where you left off</p>
          <p className="font-serif text-lg text-ink mb-4">{nextLesson.title}</p>
          <Link
            href={`/learn/${params.courseId}/lessons/${nextLesson.id}`}
            className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm inline-block"
          >
            Continue learning
          </Link>
        </div>
      ) : (
        <p className="text-ink/60">This course doesn't have any lessons published yet.</p>
      )}
    </div>
  );
}
