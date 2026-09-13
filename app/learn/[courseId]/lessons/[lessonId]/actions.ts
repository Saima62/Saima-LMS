'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Toggles a lesson's completed state for the logged-in student, then checks
// whether every lesson in the course is now done — if so, marks the
// enrollment 'completed' so it counts correctly in the student's dashboard
// and the admin "Completed courses" stat. (Certificate PDF issuance is a
// later phase; this only updates the enrollment status.)
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
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id, module:modules!inner(course_id)')
      .eq('module.course_id', courseId);

    const { data: doneRows } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('student_id', user.id)
      .eq('completed', true);
    const doneIds = new Set((doneRows || []).map((r) => r.lesson_id));

    const total = allLessons?.length || 0;
    const done = (allLessons || []).filter((l: any) => doneIds.has(l.id)).length;

    if (total > 0 && done === total) {
      await supabase
        .from('enrollments')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active');

      // Idempotent — safe to call even if a certificate already exists,
      // or if this fires more than once (e.g. the student un-marks and
      // re-marks the final lesson).
      await supabase.rpc('issue_certificate_if_eligible', { p_course_id: courseId });
    }
  }

  revalidatePath(`/learn/${courseId}/lessons/${lessonId}`);
  revalidatePath(`/learn/${courseId}`);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/certificates');
}
