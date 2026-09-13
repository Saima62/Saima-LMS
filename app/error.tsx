'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Logged to the server/Vercel function logs so you can see what happened,
    // without showing the raw technical message to the visitor.
    console.error(error);
  }, [error]);

  return (
    <div className="container-academy py-24 max-w-lg text-center">
      <h1 className="font-serif text-2xl text-ink mb-3">Something went wrong.</h1>
      <p className="text-ink/60 text-sm mb-8">
        That's on us, not you. Try again — if it keeps happening, please get in touch from the
        Contact page.
      </p>
      <button
        onClick={() => reset()}
        className="bg-ink text-paper px-6 py-3 rounded-sm hover:bg-academy-700 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
