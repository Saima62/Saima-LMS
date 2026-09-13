import Link from 'next/link';

type Course = {
  slug: string;
  title: string;
  short_description: string | null;
  price: number;
  duration_weeks: number | null;
  level: string;
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="block border border-academy-100 rounded-sm p-6 bg-white hover:border-gold transition-colors"
    >
      <p className="text-xs uppercase tracking-wide text-academy-600 mb-3">
        {course.level.replace('_', ' ')}
      </p>
      <h3 className="font-serif text-xl text-ink mb-2">{course.title}</h3>
      <p className="text-sm text-ink/70 mb-6">{course.short_description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink/60">
          {course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}
        </span>
        <span className="font-medium text-ink">
          {course.price === 0 ? 'Free' : `PKR ${course.price.toLocaleString()}`}
        </span>
      </div>
    </Link>
  );
}
