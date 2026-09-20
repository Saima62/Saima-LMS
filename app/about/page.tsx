import { createClient } from '@/lib/supabase/server';

export default async function AboutPage() {
  const supabase = await createClient();
  const [{ count: studentCount }, { count: courseCount }, { data: settings }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('academy_settings').select('profile_photo_url').eq('id', 1).maybeSingle()
  ]);

  const focusAreas = [
    'Spoken English',
    'Communication Skills',
    'School Subject Tuition',
    'Computer Education',
    'Student Confidence Building'
  ];

  const qualifications = [
    "Master's in Physical Education — University of Sargodha (2020)",
    'B.Ed — Allama Iqbal Open University',
    'Teacher Training Workshop — Quaid-e-Azam Academy (6-day, Sept 2023)',
    'PPSC Qualified',
    '2nd position secured on merit'
  ];

  const experience = [
    {
      role: 'English Tutor',
      org: 'Online Tutoring',
      points: [
        'Spoken and conversational English lessons for adult learners',
        'Vocabulary and communication skill-building',
        'Personalized lesson plans for individual students'
      ]
    },
    {
      role: 'Sports Teacher',
      org: 'Hope School of Science',
      points: [
        'Teaching and lesson planning for students',
        'Classroom management and student engagement',
        'Organizing sports activities and supporting physical development'
      ]
    },
    {
      role: 'Business Development Executive',
      org: 'Cyber Advance Solution',
      points: [
        'Business development and client interaction',
        'Digital services and professional relationship building',
        'Communication across teams and clients'
      ]
    },
    {
      role: 'Flight Attendant',
      org: 'Previous professional experience',
      points: [
        'Approximately 2,000 hours of flight experience',
        'Mentored more than 40 junior flight attendants',
        'Communication, customer service and teamwork with diverse people'
      ]
    }
  ];

  const howITeach = [
    { title: 'Understand your goal', text: "We start with why you're learning English — travel, work, daily life or something else." },
    { title: 'Assess your level', text: 'A relaxed conversation to understand where you\u2019re strong and where to focus.' },
    { title: 'Build a learning plan', text: 'A lesson plan shaped around your goals, interests and pace — not a fixed course.' },
    { title: 'Practice real conversations', text: 'Lessons centered on speaking, so you build the habit of thinking and responding in English.' },
    { title: 'Track progress', text: 'We revisit your goals regularly, so progress is visible and lessons stay on track.' }
  ];

  const whoIWorkWith = [
    'Adults aged 30 and above',
    'Beginners and intermediate learners',
    'Working professionals',
    'Students preparing for everyday communication',
    'Learners who understand English but lack speaking confidence',
    'School-age students and children'
  ];

  return (
    <div>
      <section className="container-academy pt-16 pb-14 max-w-3xl">
        <p className="text-sm tracking-wide text-academy-600 mb-4">About the Academy</p>
        <h1 className="font-serif text-4xl text-ink leading-tight mb-6">
          A teacher first, in every role she's held.
        </h1>

        <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
          {settings?.profile_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.profile_photo_url}
              alt="Saima Perveen"
              className="w-32 h-32 rounded-full object-cover border border-academy-100 shrink-0"
            />
          )}
          <div>
            <p className="text-ink/70 leading-relaxed mb-4">
              Saima Perveen is an educator and tutor from Pakistan with a background that spans
              teaching, communication and professional development. Across classrooms and online
              lessons, the thread that connects her work has always been the same: helping people
              communicate with more clarity and confidence.
            </p>
            <p className="text-ink/70 leading-relaxed">
              She has spent her career preparing lessons, building educational material and
              working closely with students as they develop new skills — from the classroom, to
              sports coaching, to one-on-one English tutoring. That variety has shaped how she
              teaches: paying attention to how each learner actually learns, not just what the
              syllabus says.
            </p>
          </div>
        </div>

        <blockquote className="border-l-2 border-gold pl-5 text-ink/80 italic leading-relaxed mb-6">
          "I believe students learn best when lessons are practical, interactive, supportive and
          connected to real life. I want my students to feel comfortable making mistakes,
          practicing out loud and gradually becoming confident communicators."
        </blockquote>

        <div className="grid grid-cols-2 gap-4 max-w-sm">
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
        <h2 className="font-serif text-2xl text-ink mb-6">How I teach</h2>
        <div className="space-y-4">
          {howITeach.map((step, i) => (
            <div key={step.title} className="border border-academy-100 bg-white rounded-sm p-5 flex gap-4">
              <span className="font-serif text-2xl text-gold shrink-0">{i + 1}</span>
              <div>
                <p className="text-ink font-medium mb-1">{step.title}</p>
                <p className="text-sm text-ink/70">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-academy pb-14 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink mb-6">Where my teaching has taken shape</h2>
        <div className="space-y-4">
          {experience.map((job) => (
            <div key={job.role} className="border border-academy-100 bg-white rounded-sm p-6">
              <p className="font-serif text-lg text-ink">{job.role}</p>
              <p className="text-xs text-academy-600 mb-3">{job.org}</p>
              <ul className="space-y-1">
                {job.points.map((p) => (
                  <li key={p} className="text-sm text-ink/70 flex gap-2">
                    <span className="text-gold">—</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-academy pb-14 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink mb-4">Who I work with</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {whoIWorkWith.map((w) => (
            <div key={w} className="border border-academy-100 bg-white rounded-sm px-4 py-3 text-sm text-ink/80">
              {w}
            </div>
          ))}
        </div>
      </section>

      <section className="container-academy pb-20 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink mb-4">Qualifications</h2>
        <div className="border border-academy-100 bg-white rounded-sm p-8">
          <ul className="space-y-2">
            {qualifications.map((q) => (
              <li key={q} className="text-sm text-ink/80 flex gap-2">
                <span className="text-gold">—</span> {q}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
