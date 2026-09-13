'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PasswordForm() {
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setStatus('error');
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setStatus('error');
      setError('Passwords do not match.');
      return;
    }

    setStatus('saving');
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setStatus('error');
      setError(updateError.message);
      return;
    }

    setStatus('done');
    setPassword('');
    setConfirm('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-ink mb-1">New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-1">Confirm new password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === 'done' && <p className="text-sm text-academy-600">Password updated.</p>}
      <button
        type="submit"
        disabled={status === 'saving'}
        className="bg-ink text-paper px-6 py-2.5 rounded-sm hover:bg-academy-700 disabled:opacity-50 text-sm"
      >
        {status === 'saving' ? 'Saving…' : 'Update password'}
      </button>
    </form>
  );
}
