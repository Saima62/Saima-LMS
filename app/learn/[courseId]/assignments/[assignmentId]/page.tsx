import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AssignmentSubmitForm from '@/components/learn/AssignmentSubmitForm';
import { recordSubmission } from './actions';

export default async function AssignmentPage({
  params: paramsPromise
}: {
  params: Promise<{ courseId: string; assignmentId: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, title, instructions, due_date')
    .eq('id', params.assignmentId)
    .single();
  if (!assignment) notFound();

  const { data: submission } = await supabase
    .from('assignment_submissions')
    .select('id, file_url, status, grade, feedback, submitted_at')
    .eq('assignment_id', params.assignmentId)
    .eq('student_id', user!.id)
    .maybeSingle();

  const submitAction = recordSubmission.bind(null, params.courseId, params.assignmentId);

  return (
    <div className="max-w-2xl">
      <Link href={`/learn/${params.courseId}`} className="text-sm text-ink/50 underline mb-4 inline-block">
        ← Back to course
      </Link>
      <h1 className="font-serif text-3xl text-ink mb-1">{assignment.title}</h1>
      {assignment.due_date && (
        <p className="text-sm text-ink/50 mb-6">Due {new Date(assignment.due_date).toLocaleDateString()}</p>
      )}

      {assignment.instructions && (
        <div className="border border-academy-100 bg-white rounded-sm p-6 mb-8">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-3">Instructions</p>
          <p className="text-sm text-ink/80 whitespace-pre-wrap">{assignment.instructions}</p>
        </div>
      )}

      {submission?.status === 'graded' && (
        <div className="border border-gold/40 bg-academy-50 rounded-sm p-6 mb-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Graded</p>
          <p className="font-serif text-2xl text-ink mb-2">{submission.grade}</p>
          {submission.feedback && <p className="text-sm text-ink/70">{submission.feedback}</p>}
        </div>
      )}

      {submission?.file_url && (
        <p className="text-sm text-ink/60 mb-6">
          Current submission:{' '}
          <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="underline text-ink">
            view file
          </a>{' '}
          — submitted {new Date(submission.submitted_at).toLocaleString()}
          {submission.status === 'submitted' && ' (awaiting grading)'}
        </p>
      )}

      <div className="border border-academy-100 bg-white rounded-sm p-6">
        <p className="text-xs uppercase tracking-wide text-ink/40 mb-3">
          {submission ? 'Replace your submission' : 'Submit your work'}
        </p>
        <AssignmentSubmitForm assignmentId={assignment.id} onRecord={submitAction} />
      </div>
    </div>
  );
}
