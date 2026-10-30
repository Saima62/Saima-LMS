'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function createAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '').trim();
  const courseId = String(formData.get('course_id') || '').trim();

  if (!title || !body) {
    throw new Error('Please enter a title and a message.');
  }

  const { error } = await supabase
    .from('announcements')
    .insert({ title, body, course_id: courseId === '' ? null : courseId });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
}

export async function deleteAnnouncement(announcementId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
}
