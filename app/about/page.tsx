export default function AboutPage() {
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
      <section className="container-academy pt-16 pb-14 max-w-3xl">
        <p className="text-sm tracking-wide text-academy-600 mb-4">About the Academy</p>
        <h1 className="font-serif text-4xl text-ink leading-tight mb-6">
          Learning English the way it's actually used — not just how it's tested.
        </h1>
        <p className="text-ink/70 leading-relaxed mb-4">
          Saima Perveen English Academy was built around a simple idea: fluency comes from
          structured practice and honest feedback, not from memorizing rules in isolation. Every
          course here is designed and taught personally by Saima Perveen, an English tutor and
          educator who works with learners at every level — from complete beginners building their
          first sentences, to working professionals polishing their workplace English.
        </p>
        <p className="text-ink/70 leading-relaxed">
          Whether you're preparing for interviews, everyday conversations, or simply want to speak
          with more confidence, the academy's courses combine video lessons, real practice
          exercises, live classes, and direct feedback — so progress is something you can actually
          see, not just a feeling.
        </p>
      </section>

      <section className="container-academy pb-14">
        <h2 className="font-serif text-2xl text-ink mb-6">What we teach</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {focusAreas.map((area) => (
            <div key={area} className="border border-academy-100 bg-white rounded-sm p-5 text-sm text-ink">
              {area}
            </div>
          ))}
        </div>
      </section>

      <section className="container-academy pb-20 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink mb-4">Meet your instructor</h2>
        <div className="border border-academy-100 bg-white rounded-sm p-8">
          <p className="font-serif text-xl text-ink mb-1">Saima Perveen</p>
          <p className="text-sm text-academy-600 mb-4">Founder &amp; Lead Instructor</p>
          <p className="text-ink/70 leading-relaxed">
            Saima brings a teaching style rooted in patience, structure, and real conversation
            practice — helping learners move past textbook English into speaking they can actually
            use, whether that's in daily life, at work, or in exams.
          </p>
        </div>
      </section>
    </div>
  );
}
