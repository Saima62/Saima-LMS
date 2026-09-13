'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container-academy max-w-md py-20">
      <h1 className="font-serif text-3xl text-ink mb-2">Log in</h1>
      <p className="text-ink/60 mb-8 text-sm">Welcome back — continue your course.</p>

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
