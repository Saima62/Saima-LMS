import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateLesson, createQuiz, updateQuizSettings, addQuestion, deleteQuestion } from './actions';

export default async function EditLessonPage({
  params: paramsPromise
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const { id: courseId, lessonId } = params;

  const { data: lesson } = await supabase.from('lessons').select('*, module:modules(course_id)').eq('id', lessonId).single();
  if (!lesson) notFound();

  const { data: quiz } = await supabase.from('quizzes').select('*').eq('lesson_id', lessonId).maybeSingle();

  const { data: questions } = quiz
    ? await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('position', { ascending: true })
    : { data: [] };

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/courses/${courseId}`} className="text-sm text-ink/50 underline mb-4 inline-block">
        ← Back to course
      </Link>

      <h1 className="font-serif text-3xl text-ink mb-8">{lesson.title}</h1>

      {/* Lesson content */}
      <section className="border border-academy-100 bg-white rounded-sm p-6 mb-10">
        <h2 className="font-serif text-lg text-ink mb-4">Lesson content</h2>
        <form action={updateLesson.bind(null, courseId, lessonId)} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-1">Title</label>
            <input name="title" defaultValue={lesson.title} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Video URL (YouTube/Vimeo embed link)</label>
            <input name="video_url" defaultValue={lesson.video_url || ''} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Worksheet / PDF URL</label>
            <input name="pdf_url" defaultValue={lesson.pdf_url || ''} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Lesson notes</label>
            <textarea name="notes_html" rows={6} defaultValue={lesson.notes_html || ''} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <button className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-academy-700 transition-colors">
            Save lesson
          </button>
        </form>
      </section>

      {/* Quiz */}
      <section className="border border-academy-100 bg-white rounded-sm p-6">
        <h2 className="font-serif text-lg text-ink mb-4">Quiz</h2>

        {!quiz ? (
          <form action={createQuiz.bind(null, courseId, lessonId)} className="space-y-3">
            <p className="text-sm text-ink/60 mb-2">This lesson doesn't have a quiz yet.</p>
            <input name="title" placeholder="Quiz title" defaultValue={`${lesson.title} Quiz`} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
            <div className="flex items-center gap-4">
              <label className="text-sm text-ink/70">Passing %</label>
              <input name="passing_percentage" type="number" defaultValue={70} className="w-24 border border-academy-100 rounded-sm px-3 py-2 text-sm" />
              <label className="text-sm text-ink/70 flex items-center gap-2">
                <input type="checkbox" name="allow_retake" defaultChecked /> Allow retakes
              </label>
            </div>
            <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm">Create quiz</button>
          </form>
        ) : (
          <div>
            <form action={updateQuizSettings.bind(null, courseId, lessonId, quiz.id)} className="flex flex-wrap items-center gap-3 mb-6 bg-academy-50 p-4 rounded-sm">
              <input name="title" defaultValue={quiz.title} className="border border-academy-100 rounded-sm px-3 py-2 text-sm flex-1 min-w-[180px]" />
              <label className="text-sm text-ink/70">Passing %</label>
              <input name="passing_percentage" type="number" defaultValue={quiz.passing_percentage} className="w-20 border border-academy-100 rounded-sm px-3 py-2 text-sm" />
              <label className="text-sm text-ink/70 flex items-center gap-2">
                <input type="checkbox" name="allow_retake" defaultChecked={quiz.allow_retake} /> Allow retakes
              </label>
              <button className="text-sm bg-ink text-paper px-3 py-2 rounded-sm">Save</button>
            </form>

            <p className="text-sm font-medium text-ink mb-2">Questions ({(questions || []).length})</p>
            <ul className="space-y-3 mb-6">
              {(questions || []).map((q: any, i: number) => (
                <li key={q.id} className="border border-academy-100 rounded-sm p-4 text-sm">
                  <div className="flex items-start justify-between">
                    <p className="text-ink font-medium">
                      {i + 1}. {q.question_text}
                    </p>
                    <form action={deleteQuestion.bind(null, courseId, lessonId, q.id)}>
                      <button className="text-xs text-ink/40 hover:text-ink underline shrink-0">Delete</button>
                    </form>
                  </div>
                  <ul className="mt-2 space-y-1 text-ink/70">
                    {q.options.map((o: any) => (
                      <li key={o.id} className={o.id === q.correct_option_id ? 'text-academy-700 font-medium' : ''}>
                        {o.id === q.correct_option_id ? '✓ ' : '· '}
                        {o.text}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {(questions || []).length === 0 && <p className="text-sm text-ink/40">No questions yet.</p>}
            </ul>

            <details className="text-sm">
              <summary className="cursor-pointer text-ink underline">+ Add question</summary>
              <form action={addQuestion.bind(null, courseId, lessonId, quiz.id)} className="mt-3 space-y-3 bg-academy-50 p-4 rounded-sm">
                <div>
                  <label className="block text-ink/70 mb-1">Question type</label>
                  <select name="question_type" className="w-full border border-academy-100 rounded-sm px-3 py-2">
                    <option value="multiple_choice">Multiple choice</option>
                    <option value="true_false">True / False</option>
                  </select>
                </div>
                <textarea name="question_text" placeholder="Question text" required rows={2} className="w-full border border-academy-100 rounded-sm px-3 py-2" />

                <div className="border-t border-academy-100 pt-3">
                  <p className="text-ink/60 mb-2">
                    For multiple choice, fill in options A–D (leave unused ones blank) and mark the correct one below.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input name="option_a" placeholder="Option A" className="border border-academy-100 rounded-sm px-3 py-2" />
                    <input name="option_b" placeholder="Option B" className="border border-academy-100 rounded-sm px-3 py-2" />
                    <input name="option_c" placeholder="Option C" className="border border-academy-100 rounded-sm px-3 py-2" />
                    <input name="option_d" placeholder="Option D" className="border border-academy-100 rounded-sm px-3 py-2" />
                  </div>
                  <label className="block text-ink/70 mb-1">Correct option (a/b/c/d) — for multiple choice</label>
                  <select name="correct_option_id" className="w-full border border-academy-100 rounded-sm px-3 py-2 mb-3">
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>

                  <label className="block text-ink/70 mb-1">Correct answer — for True/False</label>
                  <select name="correct_true_false" className="w-full border border-academy-100 rounded-sm px-3 py-2">
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>

                <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm">Add question</button>
              </form>
            </details>
          </div>
        )}
      </section>
    </div>
  );
}
