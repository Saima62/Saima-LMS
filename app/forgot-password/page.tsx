'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/profile`
    });

    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="container-academy max-w-md py-20">
      <h1 className="font-serif text-3xl text-ink mb-2">Reset your password</h1>
      <p className="text-ink/60 mb-8 text-sm">
        We'll email you a secure link to set a new password.
      </p>

      {sent ? (
        <p className="text-sm text-academy-600">
          Check your inbox for a reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full border border-academy-100 rounded-sm px-3 py-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full bg-ink text-paper py-3 rounded-sm hover:bg-academy-700">
            Send reset link
          </button>
        </form>
      )}
    </div>
  );
}
