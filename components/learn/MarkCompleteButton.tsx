'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleLessonComplete } from '@/app/learn/[courseId]/lessons/[lessonId]/actions';

export default function MarkCompleteButton({
  courseId,
  lessonId,
  initiallyCompleted
}: {
  courseId: string;
  lessonId: string;
  initiallyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    const next = !completed;
    setCompleted(next); // optimistic
    startTransition(async () => {
      try {
        await toggleLessonComplete(courseId, lessonId, next);
        router.refresh();
      } catch {
        setCompleted(!next); // revert on failure
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`text-sm px-5 py-2.5 rounded-sm transition-colors disabled:opacity-50 ${
        completed ? 'bg-academy-50 text-academy-700 border border-academy-200' : 'bg-ink text-paper hover:bg-academy-700'
      }`}
    >
      {completed ? '✓ Completed — click to undo' : 'Mark lesson as complete'}
    </button>
  );
}
