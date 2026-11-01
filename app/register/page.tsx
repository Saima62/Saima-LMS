'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleResend() {
    setResendStatus('sending');
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setResendStatus(error ? 'error' : 'sent');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If your Supabase project has "Confirm email" turned on (the default),
    // signUp() creates the account but does NOT log the student in yet — no
    // session exists until they click the confirmation link in their email.
    // Sending them to /dashboard in that case would just bounce them back to
    // /login looking "broken", so show a clear message instead.
    if (!data.session) {
      setNeedsEmailConfirmation(true);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  if (needsEmailConfirmation) {
    return (
      <div className="container-academy max-w-md py-20">
        <h1 className="font-serif text-3xl text-ink mb-2">Check your email</h1>
        <p className="text-ink/70 text-sm">
          We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your
          account, then come back and{' '}
          <Link href="/login" className="underline text-ink">
            log in
          </Link>
          .
        </p>
        <p className="text-ink/60 text-sm mt-6">
          Didn't get it, or the link says it has expired? Check your spam folder, or:
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendStatus === 'sending'}
          className="mt-3 text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 disabled:opacity-50"
        >
          {resendStatus === 'sending' ? 'Sending…' : 'Resend confirmation email'}
        </button>
        {resendStatus === 'sent' && <p className="text-academy-600 text-sm mt-2">Sent — please check your inbox.</p>}
        {resendStatus === 'error' && (
          <p className="text-red-600 text-sm mt-2">Couldn't resend right now — please wait a minute and try again.</p>
        )}
      </div>
    );
  }

  return (
    <div className="container-academy max-w-md py-20">
      <h1 className="font-serif text-3xl text-ink mb-2">Create your account</h1>
      <p className="text-ink/60 mb-8 text-sm">Start learning with Saima Perveen English Academy.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-ink/70">Full name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-academy-100 rounded-sm px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-academy-100 rounded-sm px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Password</label>
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-academy-100 rounded-sm px-3 py-2 mt-1"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-ink text-paper py-3 rounded-sm hover:bg-academy-700 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account? <Link href="/login" className="text-ink underline">Log in</Link>
      </p>
    </div>
  );
}
