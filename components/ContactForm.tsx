'use client';

import { useRef, useState, useTransition } from 'react';

export default function ContactForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError('');
    startTransition(async () => {
      try {
        await onSubmit(formData);
        setStatus('done');
        formRef.current?.reset();
      } catch (err: any) {
        setStatus('error');
        setError(err?.message || 'Something went wrong sending your message. Please try again.');
      }
    });
  }

  if (status === 'done') {
    return (
      <p className="text-sm text-academy-600 border border-gold/40 bg-academy-50 rounded-sm p-5">
        Thank you — your message has been received. We'll get back to you soon.
      </p>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-ink mb-1">Name</label>
        <input
          name="name"
          required
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-1">What's this about?</label>
        <select
          name="category"
          defaultValue="General Question"
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        >
          <option>Course Inquiry</option>
          <option>Spoken English</option>
          <option>School Tuition</option>
          <option>Payment/Enrollment</option>
          <option>Live Classes</option>
          <option>General Question</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-ink mb-1">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-ink text-paper px-6 py-3 rounded-sm hover:bg-academy-700 disabled:opacity-50 text-sm"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
