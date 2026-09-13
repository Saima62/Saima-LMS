'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function scheduleLiveClass(formData: FormData) {
  const { supabase } = await requireAdmin();

  const course_id = String(formData.get('course_id') || '');
  const title = String(formData.get('title') || '').trim();
  const class_date = String(formData.get('class_date') || '');
  const class_time = String(formData.get('class_time') || '');
  const meeting_link = String(formData.get('meeting_link') || '').trim();

  if (!course_id || !title || !class_date || !class_time || !meeting_link) {
    throw new Error('All fields except instructions are required');
  }

  const { data: liveClass, error } = await supabase
    .from('live_classes')
    .insert({
      course_id,
      title,
      class_date,
      class_time,
      meeting_link,
      instructions: String(formData.get('instructions') || '') || null
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  // Notify enrolled students
  const { data: enrolled } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('course_id', course_id)
    .in('status', ['active', 'completed']);

  if (enrolled && enrolled.length > 0) {
    await supabase.from('notifications').insert(
      enrolled.map((e) => ({
        student_id: e.student_id,
        type: 'live_class',
        message: `New live class scheduled: "${title}" on ${class_date} at ${class_time}.`
      }))
    );
  }

  revalidatePath('/admin/live-classes');
}

export async function deleteLiveClass(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('live_classes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/live-classes');
}
