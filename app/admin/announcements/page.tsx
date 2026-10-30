import { createClient } from '@/lib/supabase/server';
import { createAnnouncement, deleteAnnouncement } from './actions';

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  course: { title: string } | null;
};

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase.from('courses').select('id, title').order('title');
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, body, created_at, course:courses(title)')
    .order('created_at', { ascending: false })
    .returns<AnnouncementRow[]>();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-1">Announcements</h1>
      <p className="text-ink/60 text-sm mb-8">
        Notices appear on the student dashboard — to every student, or only to students enrolled in
        one course.
      </p>

      <form action={createAnnouncement} className="border border-academy-100 bg-white rounded-sm p-6 space-y-4 mb-10">
        <div>
          <label className="block text-sm text-ink mb-1">Title</label>
          <input
            name="title"
            required
            className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
            placeholder="e.g. New live class this Saturday"
          />
        </div>
        <div>
          <label className="block text-sm text-ink mb-1">Message</label>
          <textarea
            name="body"
            required
            rows={4}
            className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-ink mb-1">Who should see it?</label>
          <select name="course_id" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white">
            <option value="">All students</option>
            {(courses || []).map((c) => (
              <option key={c.id} value={c.id}>
                Only students in: {c.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-ink text-paper px-6 py-2.5 rounded-sm hover:bg-academy-700 text-sm">
          Publish announcement
        </button>
      </form>

      <h2 className="font-serif text-lg text-ink mb-3">Published</h2>
      <div className="space-y-3">
        {(!announcements || announcements.length === 0) && (
          <p className="text-sm text-ink/50">No announcements yet.</p>
        )}
        {(announcements || []).map((a) => (
          <div key={a.id} className="border border-academy-100 bg-white rounded-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-ink font-medium">{a.title}</p>
              <form action={deleteAnnouncement.bind(null, a.id)}>
                <button className="text-xs text-ink/50 underline shrink-0">Delete</button>
              </form>
            </div>
            <p className="text-xs text-ink/50 mb-2">
              {new Date(a.created_at).toLocaleDateString()} · {a.course ? a.course.title : 'All students'}
            </p>
            <p className="text-sm text-ink/70 whitespace-pre-wrap">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
