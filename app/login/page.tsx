'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [linkExpired, setLinkExpired] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if (searchParams.get('confirm') === 'expired') {
      setLinkExpired(true);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError('Incorrect email or password.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  async function handleResend() {
    if (!email) {
      setError('Enter your email above first, then tap "Resend confirmation email".');
      return;
    }
    setResendStatus('sending');
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setResendStatus(error ? 'error' : 'sent');
  }

  return (
    <div className="container-academy max-w-md py-20">
      <h1 className="font-serif text-3xl text-ink mb-2">Log in</h1>
      <p className="text-ink/60 mb-8 text-sm">Welcome back — continue your course.</p>

      {linkExpired && (
        <div className="border border-gold/40 bg-academy-50 rounded-sm p-4 mb-6 text-sm">
          <p className="text-ink mb-2">
            That confirmation link had expired or was already used. Enter your email below and
            tap "Resend confirmation email" to get a fresh one.
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendStatus === 'sending'}
            className="text-sm bg-ink text-paper px-4 py-2 rounded-sm hover:bg-academy-700 disabled:opacity-50"
          >
            {resendStatus === 'sending' ? 'Sending…' : 'Resend confirmation email'}
          </button>
          {resendStatus === 'sent' && (
            <p className="text-academy-600 mt-2">Sent — check your inbox (and spam folder).</p>
          )}
          {resendStatus === 'error' && (
            <p className="text-red-600 mt-2">Couldn't resend — please try again in a moment.</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="flex justify-between text-sm text-ink/60 mt-6">
        <Link href="/forgot-password" className="underline">Forgot password?</Link>
        <Link href="/register" className="underline">Create account</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
