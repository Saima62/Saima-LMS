import { createClient } from '@/lib/supabase/server';
import { scheduleLiveClass, deleteLiveClass } from './actions';

export default async function AdminLiveClassesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase.from('courses').select('id, title').order('title');

  const { data: classes } = await supabase
    .from('live_classes')
    .select('id, title, class_date, class_time, meeting_link, course:courses(title)')
    .order('class_date', { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-1">Live classes</h1>
      <p className="text-ink/60 text-sm mb-8">
        Meeting links are only ever shown to students enrolled in the matching course.
      </p>

      <section className="border border-academy-100 bg-white rounded-sm p-6 mb-10 max-w-xl">
        <h2 className="font-serif text-lg text-ink mb-4">Schedule a class</h2>
        <form action={scheduleLiveClass} className="space-y-3">
          <select name="course_id" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm">
            <option value="">Select a course…</option>
            {(courses || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <input name="title" placeholder="Class title (e.g. Week 3 Speaking Practice)" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input name="class_date" type="date" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
            <input name="class_time" placeholder="7:00 PM" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <input name="meeting_link" placeholder="Zoom / Google Meet link" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          <textarea name="instructions" placeholder="Instructions (optional)" rows={2} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          <button className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-academy-700 transition-colors">
            Schedule class
          </button>
        </form>
      </section>

      <h2 className="font-serif text-lg text-ink mb-3">Upcoming & past classes</h2>
      <div className="border border-academy-100 rounded-sm bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-academy-50 text-left text-ink/70">
            <tr>
              <th className="px-5 py-3 font-medium">Course</th>
              <th className="px-5 py-3 font-medium">Class</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(classes || []).map((c: any) => (
              <tr key={c.id} className="border-t border-academy-100">
                <td className="px-5 py-3 text-ink">{c.course?.title}</td>
                <td className="px-5 py-3 text-ink/80">{c.title}</td>
                <td className="px-5 py-3 text-ink/60">
                  {c.class_date} — {c.class_time}
                </td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteLiveClass.bind(null, c.id)}>
                    <button className="text-xs text-ink/40 hover:text-ink underline">Cancel</button>
                  </form>
                </td>
              </tr>
            ))}
            {(classes || []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink/50">No classes scheduled yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
