'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-academy py-20 max-w-lg text-center">
      <h1 className="font-serif text-2xl text-ink mb-3">We couldn't load your dashboard.</h1>
      <p className="text-ink/60 text-sm mb-8">
        This is usually temporary — a connection hiccup while loading your courses or progress.
        Give it another try, and if it keeps happening please contact us so we can look into it.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-ink text-paper px-6 py-3 rounded-sm hover:bg-academy-700 text-sm"
        >
          Try again
        </button>
        <Link href="/contact" className="text-sm text-ink/60 underline">
          Contact us
        </Link>
      </div>
    </div>
  );
}
