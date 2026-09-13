'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createCourse(formData: FormData) {
  const { supabase, userId } = await requireAdmin();

  const title = String(formData.get('title') || '').trim();
  if (!title) throw new Error('Title is required');

  const objectivesRaw = String(formData.get('learning_objectives') || '');
  const learning_objectives = objectivesRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      slug: slugify(title) + '-' + Math.random().toString(36).slice(2, 6),
      short_description: String(formData.get('short_description') || ''),
      description: String(formData.get('description') || ''),
      cover_image_url: String(formData.get('cover_image_url') || '') || null,
      price: Number(formData.get('price') || 0),
      duration_weeks: Number(formData.get('duration_weeks') || 0) || null,
      level: String(formData.get('level') || 'all_levels'),
      learning_objectives,
      status: 'draft',
      created_by: userId
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/admin/courses');
  redirect(`/admin/courses/${data.id}`);
}
