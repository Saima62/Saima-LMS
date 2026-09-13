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
