'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EnrollButton({ courseId, isFree }: { courseId: string; isFree: boolean }) {
  const supabase = createClient();
  const router = useRouter();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function enroll(paymentReference?: string) {
    setStatus('loading');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('enrollments').insert({
      student_id: user.id,
      course_id: courseId,
      status: isFree ? 'active' : 'pending_payment',
      payment_reference: paymentReference || null
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    setStatus('done');
    router.push('/dashboard/my-courses');
  }

  if (status === 'done') {
    return <p className="text-sm text-academy-600">You're enrolled — check My Courses.</p>;
  }

  if (isFree) {
    return (
      <button
        onClick={() => enroll()}
        disabled={status === 'loading'}
        className="w-full bg-ink text-paper py-3 rounded-sm hover:bg-academy-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Enrolling…' : 'Enroll for free'}
      </button>
    );
  }

  if (!showPaymentForm) {
    return (
      <button
        onClick={() => setShowPaymentForm(true)}
        className="w-full bg-ink text-paper py-3 rounded-sm hover:bg-academy-700"
      >
        Enroll now
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink/70">
        Send payment to the account details shared on the Contact page, then paste your
        transaction reference/ID below. Your seat is confirmed once reviewed.
      </p>
      <input
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="Payment reference or transaction ID"
        className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
      />
      <button
        onClick={() => enroll(reference)}
        disabled={!reference || status === 'loading'}
        className="w-full bg-ink text-paper py-3 rounded-sm hover:bg-academy-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting…' : 'Submit for approval'}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
