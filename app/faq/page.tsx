const faqs = [
  {
    q: 'How do the courses work?',
    a: 'Each course is broken into weekly modules. Every module has video lessons, notes, downloadable worksheets, and often a short quiz. You work through lessons at your own pace and mark each one complete as you finish it.'
  },
  {
    q: 'Are classes live or pre-recorded?',
    a: 'Both. Lesson videos are pre-recorded so you can learn on your own schedule, and enrolled students also get access to scheduled live classes for real conversation practice — the meeting link appears on your dashboard once a class is scheduled.'
  },
  {
    q: 'How do I pay for a paid course?',
    a: 'Choose "Enroll now" on the course page, send payment using the details on the Contact page, then submit your transaction reference. Enrollment is confirmed once it\u2019s reviewed, usually within 24 hours.'
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes. Once you\u2019ve completed every lesson in a course, a certificate is issued automatically and appears under Certificates on your dashboard, ready to download as a PDF.'
  },
  {
    q: 'Can I retake a quiz if I don\u2019t pass?',
    a: 'That depends on the quiz \u2014 most allow retakes, and you\u2019ll see a "Retake quiz" option on your result page if so. If a quiz doesn\u2019t allow retakes, your best (and only) attempt stands.'
  },
  {
    q: 'What if my assignment needs to be resubmitted?',
    a: 'You can upload a new file on the assignment page at any time \u2014 it replaces your previous submission and goes back into the grading queue.'
  },
  {
    q: 'Are the courses suitable for complete beginners?',
    a: 'Yes \u2014 course levels are marked on each course page (beginner, intermediate, advanced, or all levels), so you can pick what fits you.'
  }
];

export default function FaqPage() {
  return (
    <div className="container-academy py-16 max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-2">Frequently Asked Questions</h1>
      <p className="text-ink/60 mb-10">Answers to the questions we hear most often.</p>

      <div className="space-y-3">
        {faqs.map((item) => (
          <details key={item.q} className="border border-academy-100 bg-white rounded-sm p-5 group">
            <summary className="cursor-pointer font-medium text-ink list-none flex items-center justify-between">
              {item.q}
              <span className="text-ink/40 group-open:rotate-45 transition-transform ml-4">+</span>
            </summary>
            <p className="text-sm text-ink/70 mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
