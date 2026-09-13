'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function updateCourse(courseId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const objectivesRaw = String(formData.get('learning_objectives') || '');
  const learning_objectives = objectivesRaw.split('\n').map((s) => s.trim()).filter(Boolean);

  const { error } = await supabase
    .from('courses')
    .update({
      title: String(formData.get('title') || ''),
      short_description: String(formData.get('short_description') || ''),
      description: String(formData.get('description') || ''),
      cover_image_url: String(formData.get('cover_image_url') || '') || null,
      price: Number(formData.get('price') || 0),
      duration_weeks: Number(formData.get('duration_weeks') || 0) || null,
      level: String(formData.get('level') || 'all_levels'),
      learning_objectives,
      updated_at: new Date().toISOString()
    })
    .eq('id', courseId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

export async function togglePublish(courseId: string, nextStatus: 'draft' | 'published' | 'archived') {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('courses').update({ status: nextStatus }).eq('id', courseId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

export async function addModule(courseId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') || '').trim();
  if (!title) throw new Error('Module title is required');

  const { count } = await supabase
    .from('modules')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId);

  const { error } = await supabase.from('modules').insert({
    course_id: courseId,
    title,
    position: count || 0
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModule(courseId: string, moduleId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('modules').delete().eq('id', moduleId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function addLesson(courseId: string, moduleId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') || '').trim();
  if (!title) throw new Error('Lesson title is required');

  const { count } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('module_id', moduleId);

  const { error } = await supabase.from('lessons').insert({
    module_id: moduleId,
    title,
    video_url: String(formData.get('video_url') || '') || null,
    notes_html: String(formData.get('notes_html') || '') || null,
    pdf_url: String(formData.get('pdf_url') || '') || null,
    position: count || 0
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(courseId: string, lessonId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function addAssignment(courseId: string, moduleId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') || '').trim();
  if (!title) throw new Error('Assignment title is required');

  const { error } = await supabase.from('assignments').insert({
    module_id: moduleId,
    title,
    instructions: String(formData.get('instructions') || ''),
    due_date: String(formData.get('due_date') || '') || null
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/assignments');
}

export async function deleteAssignment(courseId: string, assignmentId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/assignments');
}
