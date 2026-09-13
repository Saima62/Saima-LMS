'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('lessons')
    .update({
      title: String(formData.get('title') || ''),
      video_url: String(formData.get('video_url') || '') || null,
      notes_html: String(formData.get('notes_html') || '') || null,
      pdf_url: String(formData.get('pdf_url') || '') || null
    })
    .eq('id', lessonId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createQuiz(courseId: string, lessonId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('quizzes').insert({
    lesson_id: lessonId,
    title: String(formData.get('title') || 'Lesson Quiz'),
    passing_percentage: Number(formData.get('passing_percentage') || 70),
    allow_retake: formData.get('allow_retake') === 'on'
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function updateQuizSettings(courseId: string, lessonId: string, quizId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('quizzes')
    .update({
      title: String(formData.get('title') || 'Lesson Quiz'),
      passing_percentage: Number(formData.get('passing_percentage') || 70),
      allow_retake: formData.get('allow_retake') === 'on'
    })
    .eq('id', quizId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function addQuestion(courseId: string, lessonId: string, quizId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const questionType = String(formData.get('question_type') || 'multiple_choice');
  const question_text = String(formData.get('question_text') || '').trim();
  if (!question_text) throw new Error('Question text is required');

  let options: { id: string; text: string }[];
  let correct_option_id: string;

  if (questionType === 'true_false') {
    options = [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' }
    ];
    correct_option_id = String(formData.get('correct_true_false') || 'true');
  } else {
    options = ['a', 'b', 'c', 'd']
      .map((id) => ({ id, text: String(formData.get(`option_${id}`) || '').trim() }))
      .filter((o) => o.text.length > 0);
    correct_option_id = String(formData.get('correct_option_id') || 'a');
    if (options.length < 2) throw new Error('Add at least two answer options');
  }

  const { count } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', quizId);

  const { error } = await supabase.from('quiz_questions').insert({
    quiz_id: quizId,
    question_type: questionType,
    question_text,
    options,
    correct_option_id,
    position: count || 0
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function deleteQuestion(courseId: string, lessonId: string, questionId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
}
