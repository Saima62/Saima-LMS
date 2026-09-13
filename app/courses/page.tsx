import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/CourseCard';

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, title, short_description, price, duration_weeks, level')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <div className="container-academy py-16">
      <h1 className="font-serif text-3xl text-ink mb-2">Courses</h1>
      <p className="text-ink/70 mb-10 max-w-xl">
        Every course is built around real conversation, not just textbook grammar.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map((c) => <CourseCard key={c.slug} course={c} />)
        ) : (
          <p className="text-ink/60 text-sm">No courses published yet.</p>
        )}
      </div>
    </div>
  );
}
