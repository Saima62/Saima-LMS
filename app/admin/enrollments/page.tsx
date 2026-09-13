import { createClient } from '@/lib/supabase/server';
import { approveEnrollment, rejectEnrollment } from './actions';

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from('enrollments')
    .select('id, payment_reference, enrolled_at, student:profiles(full_name), course:courses(title, price)')
    .eq('status', 'pending_payment')
    .order('enrolled_at', { ascending: true });

  const { data: recent } = await supabase
    .from('enrollments')
    .select('id, status, enrolled_at, student:profiles(full_name), course:courses(title)')
    .neq('status', 'pending_payment')
    .order('enrolled_at', { ascending: false })
    .limit(15);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-1">Enrollments</h1>
      <p className="text-ink/60 text-sm mb-8">Approve manual payments to unlock course access.</p>

      <h2 className="font-serif text-lg text-ink mb-3">Awaiting approval</h2>
      <div className="space-y-3 mb-10">
        {(pending || []).length === 0 && (
          <p className="text-sm text-ink/50 border border-academy-100 bg-white rounded-sm p-5">
            Nothing waiting on approval right now.
          </p>
        )}
        {(pending || []).map((e: any) => (
          <div key={e.id} className="border border-academy-100 bg-white rounded-sm p-5 flex items-start justify-between gap-6">
            <div>
              <p className="text-ink font-medium">
                {e.student?.full_name} → {e.course?.title}
              </p>
              <p className="text-sm text-ink/60">Price: PKR {e.course?.price} · Submitted {new Date(e.enrolled_at).toLocaleString()}</p>
              <p className="text-sm text-ink/80 mt-2">
                Payment reference: <span className="font-mono">{e.payment_reference || 'none provided'}</span>
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <form action={approveEnrollment.bind(null, e.id)}>
                <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 transition-colors">
                  Approve
                </button>
              </form>
              <form action={rejectEnrollment.bind(null, e.id)}>
                <button className="text-sm border border-academy-100 text-ink/70 px-4 py-2 rounded-sm hover:bg-academy-50 transition-colors">
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-lg text-ink mb-3">Recent activity</h2>
      <div className="border border-academy-100 rounded-sm bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-academy-50 text-left text-ink/70">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Course</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(recent || []).map((e: any) => (
              <tr key={e.id} className="border-t border-academy-100">
                <td className="px-5 py-3 text-ink">{e.student?.full_name}</td>
                <td className="px-5 py-3 text-ink/80">{e.course?.title}</td>
                <td className="px-5 py-3 text-ink/60 capitalize">{e.status.replace('_', ' ')}</td>
                <td className="px-5 py-3 text-ink/50">{new Date(e.enrolled_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(recent || []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink/50">No activity yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
