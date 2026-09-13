import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import QuizForm from '@/components/learn/QuizForm';
import { submitQuizAttempt } from './actions';

export default async function QuizPage({
  params: paramsPromise
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, passing_percentage, allow_retake')
    .eq('lesson_id', params.lessonId)
    .maybeSingle();
  if (!quiz) notFound();

  const { data: previousAttempt } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('quiz_id', quiz.id)
    .eq('student_id', user!.id)
    .limit(1)
    .maybeSingle();

  // Already attempted and retakes are off — send them to the lesson page instead.
  if (previousAttempt && !quiz.allow_retake) {
    redirect(`/learn/${params.courseId}/lessons/${params.lessonId}`);
  }

  // Read through the safe view — it never includes correct_option_id.
  const { data: questions } = await supabase
    .from('quiz_questions_public')
    .select('id, question_type, question_text, options, position')
    .eq('quiz_id', quiz.id)
    .order('position', { ascending: true });

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl">
        <p className="text-ink/60">This quiz doesn't have any questions yet — check back soon.</p>
      </div>
    );
  }

  const submit = submitQuizAttempt.bind(null, params.courseId, params.lessonId, quiz.id);

  return (
    <div className="max-w-2xl">
      <Link
        href={`/learn/${params.courseId}/lessons/${params.lessonId}`}
        className="text-sm text-ink/50 underline mb-4 inline-block"
      >
        ← Back to lesson
      </Link>
      <h1 className="font-serif text-3xl text-ink mb-1">{quiz.title}</h1>
      <p className="text-sm text-ink/60 mb-8">
        {questions.length} question{questions.length === 1 ? '' : 's'} · passing score {quiz.passing_percentage}%
      </p>
      <QuizForm questions={questions as any} onSubmit={submit} />
    </div>
  );
}
