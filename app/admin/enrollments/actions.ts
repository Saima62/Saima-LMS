'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function approveEnrollment(enrollmentId: string) {
  const { supabase, userId } = await requireAdmin();

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('student_id, course:courses(title)')
    .eq('id', enrollmentId)
    .single();

  const { error } = await supabase
    .from('enrollments')
    .update({ status: 'active' })
    .eq('id', enrollmentId);
  if (error) throw new Error(error.message);

  if (enrollment) {
    await supabase.from('notifications').insert({
      student_id: enrollment.student_id,
      type: 'enrollment',
      message: `Your enrollment in "${(enrollment.course as any)?.title}" has been approved. You can start learning now.`
    });
  }

  revalidatePath('/admin/enrollments');
  revalidatePath('/admin');
}

export async function rejectEnrollment(enrollmentId: string) {
  const { supabase } = await requireAdmin();

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('student_id, course:courses(title)')
    .eq('id', enrollmentId)
    .single();

  const { error } = await supabase
    .from('enrollments')
    .update({ status: 'rejected' })
    .eq('id', enrollmentId);
  if (error) throw new Error(error.message);

  if (enrollment) {
    await supabase.from('notifications').insert({
      student_id: enrollment.student_id,
      type: 'enrollment',
      message: `We couldn't verify your payment for "${(enrollment.course as any)?.title}". Please contact us or resubmit your payment reference.`
    });
  }

  revalidatePath('/admin/enrollments');
  revalidatePath('/admin');
}
