'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Grading happens entirely inside Postgres (see submit_quiz_attempt in
// supabase/schema.sql) — the correct answers never travel to the browser
// at any point, before or after submission.
export async function submitQuizAttempt(
  courseId: string,
  lessonId: string,
  quizId: string,
  answers: Record<string, string>
) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .rpc('submit_quiz_attempt', { p_quiz_id: quizId, p_answers: answers })
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/learn/${courseId}/lessons/${lessonId}`);
  revalidatePath('/dashboard');

  const attemptId = (data as any).attempt_id;
  redirect(`/learn/${courseId}/lessons/${lessonId}/quiz/result/${attemptId}`);
}
