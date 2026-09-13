import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/CourseCard';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, title, short_description, price, duration_weeks, level')
    .eq('status', 'published')
    .limit(3);

  const focusAreas = [
    'Spoken English',
    'Conversational English',
    'English for Adults',
    'English for Kids',
    'English Grammar',
    'Everyday English',
    'English for Workplace',
    'Personalized English Learning'
  ];

  return (
    <div>
      <section className="container-academy pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm tracking-wide text-academy-600 mb-4">Saima Perveen English Academy</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
            Learn to speak English with confidence, not just correctness.
          </h1>
          <p className="text-ink/70 mb-8 max-w-md">
            Structured courses, live practice and honest feedback from a dedicated tutor —
            built for adults, professionals and learners who want to actually use English, not just study it.
          </p>
          <div className="flex gap-4">
            <Link href="/courses" className="bg-ink text-paper px-6 py-3 rounded-sm hover:bg-academy-700">
              Browse courses
            </Link>
            <Link href="/about" className="px-6 py-3 rounded-sm border border-ink/20 hover:border-ink">
              Meet your tutor
            </Link>
          </div>
        </div>
        <div className="bg-white border border-academy-100 rounded-sm p-8">
          <p className="font-serif text-lg text-ink mb-4">What you'll focus on</p>
          <ul className="grid grid-cols-2 gap-3 text-sm text-ink/70">
            {focusAreas.map((area) => (
              <li key={area} className="border-l-2 border-gold pl-3">{area}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-academy pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-2xl text-ink">Popular courses</h2>
          <Link href="/courses" className="text-sm text-academy-600 hover:text-ink">View all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((c) => <CourseCard key={c.slug} course={c} />)
          ) : (
            <p className="text-ink/60 text-sm">
              No published courses yet — add your first one from the Admin Dashboard.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
