import { createClient } from '@/lib/supabase/server';
import { gradeSubmission } from './actions';

export default async function AdminAssignmentsPage() {
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select(
      'id, file_url, status, grade, feedback, submitted_at, student:profiles(full_name), assignment:assignments(title, module:modules(title, course:courses(title)))'
    )
    .order('submitted_at', { ascending: false });

  const pending = (submissions || []).filter((s: any) => s.status === 'submitted');
  const graded = (submissions || []).filter((s: any) => s.status === 'graded');

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-1">Assignments</h1>
      <p className="text-ink/60 text-sm mb-8">Review student submissions and add grades and feedback.</p>

      <h2 className="font-serif text-lg text-ink mb-3">Awaiting grading ({pending.length})</h2>
      <div className="space-y-4 mb-10">
        {pending.length === 0 && (
          <p className="text-sm text-ink/50 border border-academy-100 bg-white rounded-sm p-5">Nothing to grade right now.</p>
        )}
        {pending.map((s: any) => (
          <div key={s.id} className="border border-academy-100 bg-white rounded-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-ink font-medium">
                  {s.student?.full_name} — {s.assignment?.title}
                </p>
                <p className="text-xs text-ink/50">
                  {s.assignment?.module?.course?.title} · {s.assignment?.module?.title} · submitted{' '}
                  {new Date(s.submitted_at).toLocaleString()}
                </p>
              </div>
              {s.file_url && (
                <a href={s.file_url} target="_blank" className="text-sm underline text-ink shrink-0">
                  View submission
                </a>
              )}
            </div>
            <form action={gradeSubmission.bind(null, s.id)} className="flex flex-wrap gap-2 items-start">
              <input name="grade" placeholder="Grade (e.g. A, 8/10)" required className="border border-academy-100 rounded-sm px-3 py-2 text-sm w-40" />
              <input name="feedback" placeholder="Feedback for the student" className="flex-1 min-w-[200px] border border-academy-100 rounded-sm px-3 py-2 text-sm" />
              <button className="text-sm bg-ink text-paper px-4 py-2 rounded-sm">Submit grade</button>
            </form>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-lg text-ink mb-3">Graded</h2>
      <div className="border border-academy-100 rounded-sm bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-academy-50 text-left text-ink/70">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Assignment</th>
              <th className="px-5 py-3 font-medium">Grade</th>
              <th className="px-5 py-3 font-medium">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {graded.map((s: any) => (
              <tr key={s.id} className="border-t border-academy-100">
                <td className="px-5 py-3 text-ink">{s.student?.full_name}</td>
                <td className="px-5 py-3 text-ink/80">{s.assignment?.title}</td>
                <td className="px-5 py-3 text-ink/80">{s.grade}</td>
                <td className="px-5 py-3 text-ink/60">{s.feedback}</td>
              </tr>
            ))}
            {graded.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink/50">No graded submissions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
