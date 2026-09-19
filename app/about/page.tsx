import { createClient } from '@/lib/supabase/server';

export default async function AboutPage() {
  const supabase = await createClient();
  const [{ count: studentCount }, { count: courseCount }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published')
  ]);

  const focusAreas = [
    'Spoken English',
    'Communication Skills',
    'School Subject Tuition',
    'Computer Education',
    'Student Confidence Building'
  ];

  const qualifications = [
    "Master's in Physical Education — University of Sargodha",
    'B.Ed — Allama Iqbal Open University',
    'PPSC Qualified',
    '2nd position secured on merit'
  ];

  return (
    <div>
      <section className="container-academy pt-16 pb-14 max-w-3xl">
        <p className="text-sm tracking-wide text-academy-600 mb-4">About the Academy</p>
        <h1 className="font-serif text-4xl text-ink leading-tight mb-6">
          Learning English the way it's actually used — not just how it's tested.
        </h1>
        <p className="text-ink/70 leading-relaxed mb-4">
          Saima Perveen is an English Tutor &amp; Educator dedicated to helping learners build
          confidence, improve communication skills and develop practical English for everyday,
          academic and professional life. Her teaching approach focuses on structured learning,
          speaking practice, vocabulary, grammar, confidence building and real-life communication.
        </p>
        <p className="text-ink/70 leading-relaxed">
          Alongside English tutoring, Saima brings a background in teacher training and
          professional development, experience teaching school subjects, and dedicated online
          English and spoken English tutoring — combining structured lesson planning with genuine,
          one-on-one attention to how each student actually learns.
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-sm">
          <div className="border border-academy-100 bg-white rounded-sm p-5 text-center">
            <p className="font-serif text-3xl text-ink">{studentCount ?? 0}</p>
            <p className="text-xs text-ink/50 mt-1">Students enrolled</p>
          </div>
          <div className="border border-academy-100 bg-white rounded-sm p-5 text-center">
            <p className="font-serif text-3xl text-ink">{courseCount ?? 0}</p>
            <p className="text-xs text-ink/50 mt-1">Courses live</p>
          </div>
        </div>
      </section>

      <section className="container-academy pb-14">
        <h2 className="font-serif text-2xl text-ink mb-6">Teaching focus</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          {focusAreas.map((area) => (
            <div key={area} className="border border-academy-100 bg-white rounded-sm p-5 text-sm text-ink">
              {area}
            </div>
          ))}
        </div>
      </section>

      <section className="container-academy pb-14 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink mb-4">Teaching philosophy</h2>
        <div className="border border-academy-100 bg-white rounded-sm p-8">
          <p className="text-ink/70 leading-relaxed">
            Learning should be practical, structured and confidence-building. Students should have
            opportunities to understand concepts, practise skills and use what they learn in real
            situations.
          </p>
        </div>
      </section>

      <section className="container-academy pb-20 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink mb-4">Meet your instructor</h2>
        <div className="border border-academy-100 bg-white rounded-sm p-8">
          <p className="font-serif text-xl text-ink mb-1">Saima Perveen</p>
          <p className="text-sm text-academy-600 mb-6">Founder &amp; Lead Instructor · English Tutor &amp; Educator</p>

          <p className="text-xs uppercase tracking-wide text-ink/40 mb-3">Qualifications</p>
          <ul className="space-y-2 mb-6">
            {qualifications.map((q) => (
              <li key={q} className="text-sm text-ink/80 flex gap-2">
                <span className="text-gold">—</span> {q}
              </li>
            ))}
          </ul>

          <p className="text-ink/70 leading-relaxed">
            Saima brings a teaching style rooted in patience, structure, and real conversation
            practice — helping learners move past textbook English into speaking they can actually
            use, whether that's in daily life, at work, at school, or in exams.
          </p>
        </div>
      </section>
    </div>
  );
}
