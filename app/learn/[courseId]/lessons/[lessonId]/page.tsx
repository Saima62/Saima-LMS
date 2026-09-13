import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MarkCompleteButton from '@/components/learn/MarkCompleteButton';
import { embeddableVideoUrl } from '@/lib/video';

export default async function LessonPage({
  params: paramsPromise
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, video_url, notes_html, pdf_url')
    .eq('id', params.lessonId)
    .single();
  if (!lesson) notFound();

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('student_id', user!.id)
    .eq('lesson_id', params.lessonId)
    .maybeSingle();

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, passing_percentage, allow_retake')
    .eq('lesson_id', params.lessonId)
    .maybeSingle();

  const { data: bestAttempt } = quiz
    ? await supabase
        .from('quiz_attempts')
        .select('score, passed, attempted_at')
        .eq('quiz_id', quiz.id)
        .eq('student_id', user!.id)
        .order('score', { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const embedUrl = embeddableVideoUrl(lesson.video_url);

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-6">{lesson.title}</h1>

      {embedUrl && (
        <div className="aspect-video mb-6 rounded-sm overflow-hidden border border-academy-100 bg-black">
          <iframe
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {lesson.notes_html && (
        <div className="border border-academy-100 bg-white rounded-sm p-6 mb-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-3">Lesson notes</p>
          <div className="prose prose-sm max-w-none text-ink/80" dangerouslySetInnerHTML={{ __html: lesson.notes_html }} />
        </div>
      )}

      {lesson.pdf_url && (
        <a
          href={lesson.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-ink underline mb-6"
        >
          Download worksheet / PDF
        </a>
      )}

      <div className="flex items-center gap-4 mb-10">
        <MarkCompleteButton
          courseId={params.courseId}
          lessonId={lesson.id}
          initiallyCompleted={!!progress?.completed}
        />
      </div>

      {quiz && (
        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Quiz</p>
          <p className="font-serif text-lg text-ink mb-1">{quiz.title}</p>
          <p className="text-sm text-ink/60 mb-4">Passing score: {quiz.passing_percentage}%</p>

          {bestAttempt && (
            <p className={`text-sm mb-4 ${bestAttempt.passed ? 'text-academy-600' : 'text-ink/70'}`}>
              Best attempt: {bestAttempt.score}% — {bestAttempt.passed ? 'Passed' : 'Not passed yet'}
            </p>
          )}

          {(!bestAttempt || quiz.allow_retake) && (
            <Link
              href={`/learn/${params.courseId}/lessons/${lesson.id}/quiz`}
              className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm inline-block"
            >
              {bestAttempt ? 'Retake quiz' : 'Take quiz'}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
