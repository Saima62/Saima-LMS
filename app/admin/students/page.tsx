import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, phone, country, created_at')
    .order('created_at', { ascending: false });

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('student_id, status, course:courses(title)');

  // Emails live in auth.users, not in profiles — fetch via the service-role
  // admin API rather than storing a duplicate copy of the email.
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailByUserId = new Map((authUsers?.users || []).map((u) => [u.id, u.email]));

  const enrollmentsByStudent = new Map<string, { title: string; status: string }[]>();
  (enrollments || []).forEach((e: any) => {
    const list = enrollmentsByStudent.get(e.student_id) || [];
    list.push({ title: e.course?.title || 'Untitled course', status: e.status });
    enrollmentsByStudent.set(e.student_id, list);
  });

  const students = (profiles || []).filter((p) => p.role === 'student');

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-1">Students</h1>
      <p className="text-ink/60 text-sm mb-8">{students.length} registered student{students.length === 1 ? '' : 's'}.</p>

      <div className="border border-academy-100 rounded-sm bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-academy-50 text-left text-ink/70">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Courses</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t border-academy-100 align-top">
                <td className="px-5 py-3 text-ink">
                  {s.full_name}
                  {s.phone && <div className="text-xs text-ink/50">{s.phone}</div>}
                </td>
                <td className="px-5 py-3 text-ink/80">{emailByUserId.get(s.id) || '—'}</td>
                <td className="px-5 py-3 text-ink/60">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-ink/80">
                  {(enrollmentsByStudent.get(s.id) || []).length === 0 && '—'}
                  {(enrollmentsByStudent.get(s.id) || []).map((e, i) => (
                    <div key={i}>
                      {e.title} <span className="text-xs text-ink/40">({e.status})</span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink/50">
                  No students have registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
