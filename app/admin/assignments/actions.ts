'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function gradeSubmission(submissionId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { data: submission } = await supabase
    .from('assignment_submissions')
    .select('student_id, assignment:assignments(title)')
    .eq('id', submissionId)
    .single();

  const grade = String(formData.get('grade') || '');
  const feedback = String(formData.get('feedback') || '');

  const { error } = await supabase
    .from('assignment_submissions')
    .update({ grade, feedback, status: 'graded', graded_at: new Date().toISOString() })
    .eq('id', submissionId);
  if (error) throw new Error(error.message);

  if (submission) {
    await supabase.from('notifications').insert({
      student_id: submission.student_id,
      type: 'assignment',
      message: `Your submission for "${(submission.assignment as any)?.title}" has been graded: ${grade}.`
    });
  }

  revalidatePath('/admin/assignments');
}
