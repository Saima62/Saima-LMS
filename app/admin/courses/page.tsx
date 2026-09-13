import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, status, price, level, duration_weeks, modules(id)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Courses</h1>
          <p className="text-ink/60 text-sm">Create and manage what students see and learn.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 transition-colors"
        >
          + New course
        </Link>
      </div>

      <div className="border border-academy-100 rounded-sm bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-academy-50 text-left text-ink/70">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 font-medium">Modules</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(courses || []).map((c: any) => (
              <tr key={c.id} className="border-t border-academy-100">
                <td className="px-5 py-3 text-ink">{c.title}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.status === 'published'
                        ? 'bg-academy-50 text-academy-700'
                        : 'bg-academy-100 text-ink/60'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink/80">{c.price == 0 ? 'Free' : `PKR ${c.price}`}</td>
                <td className="px-5 py-3 text-ink/60 capitalize">{c.level?.replace('_', ' ')}</td>
                <td className="px-5 py-3 text-ink/60">{c.modules?.length || 0}</td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/courses/${c.id}`} className="text-sm underline text-ink">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {(courses || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink/50">
                  No courses yet — create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
