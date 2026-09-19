import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EnrollButton from './EnrollButton';

export default async function CourseDetailPage({
  params: paramsPromise
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('*, modules(id, title, position, lessons(id, title, position))')
    .eq('slug', params.slug)
    .single();

  if (!course) return notFound();

  const modules = (course.modules || []).sort((a: any, b: any) => a.position - b.position);

  return (
    <div className="container-academy py-16 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
        {course.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.cover_image_url}
            alt=""
            className="w-full h-56 object-cover rounded-sm border border-academy-100 mb-8"
          />
        )}
        <p className="text-xs uppercase tracking-wide text-academy-600 mb-3">
          {course.level.replace('_', ' ')} · {course.duration_weeks} weeks
        </p>
        <h1 className="font-serif text-3xl text-ink mb-4">{course.title}</h1>
        <p className="text-ink/70 mb-10">{course.description}</p>

        {course.learning_objectives?.length > 0 && (
          <div className="mb-10">
            <h2 className="font-serif text-xl text-ink mb-4">What you'll learn</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-ink/70">
              {course.learning_objectives.map((obj: string, i: number) => (
                <li key={i} className="border-l-2 border-gold pl-3">{obj}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="font-serif text-xl text-ink mb-4">Course outline</h2>
          <div className="divide-y divide-academy-100 border border-academy-100 rounded-sm">
            {modules.map((m: any) => (
              <div key={m.id} className="p-5">
                <p className="font-medium text-ink mb-2">{m.title}</p>
                <ul className="text-sm text-ink/60 space-y-1">
                  {(m.lessons || []).sort((a: any, b: any) => a.position - b.position).map((l: any) => (
                    <li key={l.id}>— {l.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="border border-academy-100 rounded-sm p-6 h-fit bg-white">
        <p className="font-serif text-2xl text-ink mb-1">
          {course.price === 0 ? 'Free' : `PKR ${Number(course.price).toLocaleString()}`}
        </p>
        <p className="text-sm text-ink/60 mb-6">One-time enrollment</p>
        <EnrollButton courseId={course.id} isFree={course.price === 0} />
      </aside>
    </div>
  );
}
