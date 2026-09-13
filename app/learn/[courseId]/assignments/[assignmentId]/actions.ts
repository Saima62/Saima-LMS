'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Called after the browser has already uploaded the file to Supabase Storage
// and created a signed URL for it (see AssignmentSubmitForm) — this just
// records the submission row. Re-submitting (fileUrl replaces the old one)
// resets status back to 'submitted' so it reappears in the admin grading queue.
export async function recordSubmission(courseId: string, assignmentId: string, fileUrl: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('assignment_submissions')
    .select('id')
    .eq('assignment_id', assignmentId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('assignment_submissions')
      .update({
        file_url: fileUrl,
        status: 'submitted',
        grade: null,
        feedback: null,
        submitted_at: new Date().toISOString(),
        graded_at: null
      })
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('assignment_submissions').insert({
      assignment_id: assignmentId,
      student_id: user.id,
      file_url: fileUrl,
      status: 'submitted'
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/learn/${courseId}/assignments/${assignmentId}`);
}
