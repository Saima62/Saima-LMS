'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Marks a lesson complete (or not) for the logged-in student. When a lesson is
// marked complete, a database function checks whether EVERY lesson in the
// course is now done — if so it marks the enrollment "completed" and issues
// the certificate. That check lives in the database on purpose: students are
// not allowed to edit their own enrollment row, so the browser-side version of
// this logic was silently blocked and no certificate was ever issued.
export async function toggleLessonComplete(courseId: string, lessonId: string, completed: boolean) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('lesson_progress').upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    },
    { onConflict: 'student_id,lesson_id' }
  );
  if (error) throw new Error(error.message);

  if (completed) {
    const { error: completeError } = await supabase.rpc('complete_course_if_eligible', {
      p_course_id: courseId
    });
    if (completeError) {
      // Don't fail the click (the lesson IS saved), but leave a trace in the
      // Vercel logs so a problem here is never invisible again.
      console.error('complete_course_if_eligible failed:', completeError.message);
    }
  }

  revalidatePath(`/learn/${courseId}/lessons/${lessonId}`);
  revalidatePath(`/learn/${courseId}`);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/my-courses');
  revalidatePath('/dashboard/certificates');
}
