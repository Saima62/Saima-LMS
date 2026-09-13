'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Lesson = { id: string; title: string; position: number };
type Assignment = { id: string; title: string; position: number };
type Module = { id: string; title: string; lessons: Lesson[]; assignments: Assignment[] };

export default function LearnSidebar({
  courseId,
  courseTitle,
  modules,
  completedLessonIds
}: {
  courseId: string;
  courseTitle: string;
  modules: Module[];
  completedLessonIds: string[];
}) {
  const pathname = usePathname();
  const done = new Set(completedLessonIds);

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const doneLessons = modules.reduce((n, m) => n + m.lessons.filter((l) => done.has(l.id)).length, 0);
  const percent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <nav className="w-72 shrink-0 border-r border-academy-100 min-h-screen py-10 pr-6">
      <Link href="/dashboard/my-courses" className="text-xs text-ink/50 underline mb-4 inline-block">
        ← My Courses
      </Link>
      <p className="font-serif text-lg text-ink mb-2">{courseTitle}</p>
      <div className="w-full h-1.5 bg-academy-100 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-gold" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs text-ink/50 mb-6">{percent}% complete</p>

      <div className="space-y-6">
        {modules.map((m) => (
          <div key={m.id}>
            <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">{m.title}</p>
            <ul className="space-y-1">
              {m.lessons.map((l) => {
                const href = `/learn/${courseId}/lessons/${l.id}`;
                const active = pathname === href;
                return (
                  <li key={l.id}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm ${
                        active ? 'bg-academy-50 text-ink font-medium' : 'text-ink/70 hover:bg-academy-50'
                      }`}
                    >
                      <span className={`w-4 shrink-0 ${done.has(l.id) ? 'text-academy-600' : 'text-ink/20'}`}>
                        {done.has(l.id) ? '✓' : '·'}
                      </span>
                      {l.title}
                    </Link>
                  </li>
                );
              })}
              {m.assignments.map((a) => {
                const href = `/learn/${courseId}/assignments/${a.id}`;
                const active = pathname === href;
                return (
                  <li key={a.id}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm ${
                        active ? 'bg-academy-50 text-ink font-medium' : 'text-ink/70 hover:bg-academy-50'
                      }`}
                    >
                      <span className="w-4 shrink-0 text-ink/20">✎</span>
                      {a.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
