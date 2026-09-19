import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/CourseCard';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, title, short_description, price, duration_weeks, level, cover_image_url')
    .eq('status', 'published')
    .limit(3);

  const focusAreas = [
    'Spoken English',
    'Grammar',
    'School Tuition',
    'English Communication',
    'Computer & Digital Skills'
  ];

  const whyUs = [
    { title: 'Personalized Learning', text: 'Lessons and pace shaped around how each student actually learns.' },
    { title: 'Practical Speaking Practice', text: 'Real conversation practice, not just rules to memorize.' },
    { title: 'Structured Courses', text: 'Clear modules and lessons that build on each other week by week.' },
    { title: 'Regular Progress Tracking', text: 'See completed lessons, quiz scores, and course progress at a glance.' },
    { title: 'Live Learning Support', text: 'Scheduled live classes for enrolled students, alongside self-paced lessons.' },
    { title: 'Student-Friendly Teaching', text: 'Patient, encouraging teaching suited to adults, school students, and beginners alike.' }
  ];

  return (
    <div>
      <section className="container-academy pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm tracking-wide text-academy-600 mb-4">Saima Perveen English Academy</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
            Learn English with Confidence. Build Skills for Real Life.
          </h1>
          <p className="text-ink/70 mb-8 max-w-md">
            Structured online English courses, school subject tuition and personalized learning
            support for students and adults.
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

      <section className="container-academy pb-24">
        <h2 className="font-serif text-2xl text-ink mb-8">Why Learn With Us?</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {whyUs.map((item) => (
            <div key={item.title} className="border border-academy-100 bg-white rounded-sm p-6">
              <p className="font-serif text-lg text-ink mb-2">{item.title}</p>
              <p className="text-sm text-ink/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
