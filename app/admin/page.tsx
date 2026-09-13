import { createClient } from '@/lib/supabase/server';

async function getStats() {
  const supabase = await createClient();

  const [
    { count: totalStudents },
    { count: activeStudents },
    { count: totalCourses },
    { count: completedEnrollments },
    { count: quizAttempts },
    { count: certificatesIssued },
    { count: pendingEnrollments },
    { count: pendingSubmissions },
    { count: unreadMessages }
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase
      .from('enrollments')
      .select('student_id', { count: 'exact', head: true })
      .in('status', ['active', 'completed']),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('quiz_attempts').select('id', { count: 'exact', head: true }),
    supabase.from('certificates').select('id', { count: 'exact', head: true }),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('status', 'pending_payment'),
    supabase.from('assignment_submissions').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false)
  ]);

  return {
    totalStudents: totalStudents || 0,
    activeStudents: activeStudents || 0,
    totalCourses: totalCourses || 0,
    completedEnrollments: completedEnrollments || 0,
    quizAttempts: quizAttempts || 0,
    certificatesIssued: certificatesIssued || 0,
    pendingEnrollments: pendingEnrollments || 0,
    pendingSubmissions: pendingSubmissions || 0,
    unreadMessages: unreadMessages || 0
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: 'Total students', value: stats.totalStudents },
    { label: 'Active students', value: stats.activeStudents },
    { label: 'Total courses', value: stats.totalCourses },
    { label: 'Completed courses', value: stats.completedEnrollments },
    { label: 'Quiz attempts', value: stats.quizAttempts },
    { label: 'Certificates issued', value: stats.certificatesIssued }
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-1">Overview</h1>
      <p className="text-ink/60 text-sm mb-10">A snapshot of the academy right now.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border border-academy-100 bg-white rounded-sm p-6">
            <p className="text-3xl font-serif text-ink">{c.value}</p>
            <p className="text-sm text-ink/60 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {(stats.pendingEnrollments > 0 || stats.pendingSubmissions > 0 || stats.unreadMessages > 0) && (
        <div className="border border-gold/40 bg-academy-50 rounded-sm p-6">
          <p className="font-medium text-ink mb-2">Needs your attention</p>
          <ul className="text-sm text-ink/80 space-y-1">
            {stats.pendingEnrollments > 0 && (
              <li>
                {stats.pendingEnrollments} enrollment{stats.pendingEnrollments === 1 ? '' : 's'} waiting on payment approval —{' '}
                <a href="/admin/enrollments" className="underline">
                  review now
                </a>
              </li>
            )}
            {stats.pendingSubmissions > 0 && (
              <li>
                {stats.pendingSubmissions} assignment submission{stats.pendingSubmissions === 1 ? '' : 's'} waiting to be graded —{' '}
                <a href="/admin/assignments" className="underline">
                  review now
                </a>
              </li>
            )}
            {stats.unreadMessages > 0 && (
              <li>
                {stats.unreadMessages} unread message{stats.unreadMessages === 1 ? '' : 's'} from the Contact page —{' '}
                <a href="/admin/messages" className="underline">
                  read now
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
