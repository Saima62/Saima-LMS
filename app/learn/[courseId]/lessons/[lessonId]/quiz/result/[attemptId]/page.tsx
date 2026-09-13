import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function QuizResultPage({
  params: paramsPromise
}: {
  params: Promise<{ courseId: string; lessonId: string; attemptId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();

  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('id, score, passed, quiz:quizzes(title, passing_percentage, allow_retake)')
    .eq('id', params.attemptId)
    .single();
  if (!attempt) notFound();

  // Server-side function: returns each question with is_correct, but never
  // the correct_option_id itself, so a failed attempt can be retaken fairly.
  const { data: review } = await supabase.rpc('get_quiz_attempt_review', {
    p_attempt_id: params.attemptId
  });

  const quiz = attempt.quiz as any;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/learn/${params.courseId}/lessons/${params.lessonId}`}
        className="text-sm text-ink/50 underline mb-4 inline-block"
      >
        ← Back to lesson
      </Link>

      <div
        className={`border rounded-sm p-6 mb-8 ${
          attempt.passed ? 'border-gold/40 bg-academy-50' : 'border-academy-100 bg-white'
        }`}
      >
        <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">{quiz?.title}</p>
        <p className="font-serif text-3xl text-ink mb-1">{attempt.score}%</p>
        <p className={`text-sm ${attempt.passed ? 'text-academy-700' : 'text-ink/70'}`}>
          {attempt.passed
            ? `Passed — the passing score was ${quiz?.passing_percentage}%.`
            : `Not passed — you needed ${quiz?.passing_percentage}%.`}
        </p>
        {!attempt.passed && quiz?.allow_retake && (
          <Link
            href={`/learn/${params.courseId}/lessons/${params.lessonId}/quiz`}
            className="inline-block mt-4 text-sm bg-ink text-paper px-5 py-2.5 rounded-sm"
          >
            Retake quiz
          </Link>
        )}
      </div>

      <p className="text-sm font-medium text-ink mb-3">Your answers</p>
      <ul className="space-y-3">
        {(review || []).map((q: any, i: number) => (
          <li key={q.question_id} className="border border-academy-100 bg-white rounded-sm p-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-ink">
                {i + 1}. {q.question_text}
              </p>
              <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-sm ${
                q.is_correct ? 'bg-academy-50 text-academy-700' : 'bg-red-50 text-red-600'
              }`}>
                {q.is_correct ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
