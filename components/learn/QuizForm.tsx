'use client';

import { useState, useTransition } from 'react';

type Option = { id: string; text: string };
type Question = {
  id: string;
  question_type: 'multiple_choice' | 'true_false';
  question_text: string;
  options: Option[];
  position: number;
};

export default function QuizForm({
  questions,
  onSubmit
}: {
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAnswered) return;
    setError(null);
    startTransition(async () => {
      try {
        await onSubmit(answers);
      } catch (err: any) {
        // Next.js redirect() inside the action throws internally on success —
        // only surface a message for genuine failures.
        if (err?.digest?.startsWith?.('NEXT_REDIRECT')) return;
        setError(err?.message || 'Something went wrong submitting your quiz. Please try again.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="border border-academy-100 bg-white rounded-sm p-6">
          <legend className="text-sm text-ink/50 mb-2">Question {i + 1} of {questions.length}</legend>
          <p className="text-ink font-medium mb-4">{q.question_text}</p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 border rounded-sm px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  answers[q.id] === opt.id ? 'border-ink bg-academy-50' : 'border-academy-100 hover:bg-academy-50/60'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={answers[q.id] === opt.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                  className="accent-ink"
                />
                {opt.text}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!allAnswered || isPending}
        className="bg-ink text-paper px-6 py-3 rounded-sm hover:bg-academy-700 disabled:opacity-40 text-sm"
      >
        {isPending ? 'Submitting…' : allAnswered ? 'Submit quiz' : `Answer all questions (${answeredCount}/${questions.length})`}
      </button>
    </form>
  );
}
