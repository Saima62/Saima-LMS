import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  updateCourse,
  togglePublish,
  addModule,
  deleteModule,
  addLesson,
  deleteLesson,
  addAssignment,
  deleteAssignment
} from './actions';

export default async function EditCoursePage({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const courseId = params.id;

  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single();
  if (!course) notFound();

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, position, lessons(id, title, position), assignments(id, title, due_date)')
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  const updateCourseWithId = updateCourse.bind(null, courseId);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="text-sm text-ink/50 underline mb-4 inline-block">
        ← All courses
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-3xl text-ink">{course.title}</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            course.status === 'published' ? 'bg-academy-50 text-academy-700' : 'bg-academy-100 text-ink/60'
          }`}
        >
          {course.status}
        </span>
      </div>

      <div className="flex gap-3 mb-10">
        {course.status !== 'published' ? (
          <form action={togglePublish.bind(null, courseId, 'published')}>
            <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 transition-colors">
              Publish course
            </button>
          </form>
        ) : (
          <form action={togglePublish.bind(null, courseId, 'draft')}>
            <button className="text-sm border border-academy-100 px-4 py-2 rounded-sm text-ink/70 hover:bg-academy-50 transition-colors">
              Unpublish
            </button>
          </form>
        )}
      </div>

      {/* Course details */}
      <section className="border border-academy-100 bg-white rounded-sm p-6 mb-10">
        <h2 className="font-serif text-lg text-ink mb-4">Course details</h2>
        <form action={updateCourseWithId} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-1">Title</label>
            <input name="title" defaultValue={course.title} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Short description</label>
            <input
              name="short_description"
              defaultValue={course.short_description || ''}
              className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Full description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={course.description || ''}
              className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Learning objectives (one per line)</label>
            <textarea
              name="learning_objectives"
              rows={4}
              defaultValue={(course.learning_objectives || []).join('\n')}
              className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink mb-1">Cover image URL</label>
              <input
                name="cover_image_url"
                defaultValue={course.cover_image_url || ''}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Level</label>
              <select name="level" defaultValue={course.level} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm">
                <option value="all_levels">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink mb-1">Price (PKR, 0 = free)</label>
              <input
                name="price"
                type="number"
                min="0"
                defaultValue={course.price}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Duration (weeks)</label>
              <input
                name="duration_weeks"
                type="number"
                min="1"
                defaultValue={course.duration_weeks || ''}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-academy-700 transition-colors">
            Save changes
          </button>
        </form>
      </section>

      {/* Modules & lessons */}
      <section className="mb-10">
        <h2 className="font-serif text-lg text-ink mb-4">Modules & lessons</h2>

        <div className="space-y-6">
          {(modules || []).map((m: any) => (
            <div key={m.id} className="border border-academy-100 bg-white rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-ink">{m.title}</p>
                <form action={deleteModule.bind(null, courseId, m.id)}>
                  <button className="text-xs text-ink/40 hover:text-ink underline">Delete module</button>
                </form>
              </div>

              {/* Lessons */}
              <ul className="mb-4 space-y-1">
                {(m.lessons || [])
                  .sort((a: any, b: any) => a.position - b.position)
                  .map((l: any) => (
                    <li key={l.id} className="flex items-center justify-between text-sm border-t border-academy-50 py-2">
                      <Link href={`/admin/courses/${courseId}/lessons/${l.id}`} className="text-ink underline">
                        {l.title}
                      </Link>
                      <form action={deleteLesson.bind(null, courseId, l.id)}>
                        <button className="text-xs text-ink/40 hover:text-ink underline">Delete</button>
                      </form>
                    </li>
                  ))}
                {(m.lessons || []).length === 0 && <li className="text-sm text-ink/40 py-1">No lessons yet.</li>}
              </ul>

              <details className="text-sm mb-4">
                <summary className="cursor-pointer text-ink/70 underline">+ Add lesson</summary>
                <form action={addLesson.bind(null, courseId, m.id)} className="mt-3 space-y-2 bg-academy-50 p-4 rounded-sm">
                  <input name="title" placeholder="Lesson title" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                  <input name="video_url" placeholder="Video URL (YouTube/Vimeo)" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                  <input name="pdf_url" placeholder="Worksheet/PDF URL" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                  <textarea name="notes_html" placeholder="Lesson notes" rows={3} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                  <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm">Add lesson</button>
                </form>
              </details>

              {/* Assignments */}
              <div className="border-t border-academy-50 pt-4">
                <p className="text-sm font-medium text-ink mb-2">Assignments</p>
                <ul className="mb-2 space-y-1">
                  {(m.assignments || []).map((a: any) => (
                    <li key={a.id} className="flex items-center justify-between text-sm">
                      <span className="text-ink/80">
                        {a.title} {a.due_date && <span className="text-ink/40">· due {a.due_date}</span>}
                      </span>
                      <form action={deleteAssignment.bind(null, courseId, a.id)}>
                        <button className="text-xs text-ink/40 hover:text-ink underline">Delete</button>
                      </form>
                    </li>
                  ))}
                  {(m.assignments || []).length === 0 && <li className="text-sm text-ink/40">No assignments yet.</li>}
                </ul>
                <details className="text-sm">
                  <summary className="cursor-pointer text-ink/70 underline">+ Add assignment</summary>
                  <form action={addAssignment.bind(null, courseId, m.id)} className="mt-3 space-y-2 bg-academy-50 p-4 rounded-sm">
                    <input name="title" placeholder="Assignment title" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                    <textarea name="instructions" placeholder="Instructions" rows={3} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                    <input name="due_date" type="date" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
                    <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm">Add assignment</button>
                  </form>
                </details>
              </div>
            </div>
          ))}
        </div>

        <details className="mt-6 text-sm">
          <summary className="cursor-pointer text-ink underline">+ Add module (week)</summary>
          <form action={addModule.bind(null, courseId)} className="mt-3 flex gap-2 bg-academy-50 p-4 rounded-sm">
            <input
              name="title"
              placeholder="e.g. Week 1: Introduction & Basic Conversation"
              required
              className="flex-1 border border-academy-100 rounded-sm px-3 py-2 text-sm"
            />
            <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm shrink-0">Add module</button>
          </form>
        </details>
      </section>
    </div>
  );
}
