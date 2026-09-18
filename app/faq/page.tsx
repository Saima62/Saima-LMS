const faqs = [
  {
    q: 'Who can join the academy?',
    a: 'Anyone looking to improve their English — adults, professionals, and school students — as well as those looking for school subject tuition. Courses are marked by level so you can find what fits you.'
  },
  {
    q: 'What courses are available?',
    a: 'Spoken English, English Grammar, and personalized school subject tuition covering English, Computer, and more — see the full, current list on the Courses page.'
  },
  {
    q: 'Do you offer school subject tuition?',
    a: 'Yes — school subject tuition is available with structured lessons, concept clarification, practice questions, and homework guidance.'
  },
  {
    q: 'Do you offer spoken English classes?',
    a: 'Yes — Spoken English Mastery is one of our core courses, focused on real speaking confidence and everyday conversation.'
  },
  {
    q: 'Are classes online?',
    a: 'Yes, everything is online — self-paced lesson videos and notes, plus scheduled live classes for enrolled students.'
  },
  {
    q: 'How can I enroll?',
    a: 'Open a course page and select "Enroll now." Free courses give you instant access; paid courses walk you through the payment steps.'
  },
  {
    q: 'How can I pay?',
    a: "Payment details (currently Easypaisa) are on the Contact page. After paying, submit your transaction reference on the enrollment screen — your seat is confirmed once it's reviewed."
  },
  {
    q: 'How do I contact the instructor?',
    a: 'Use the Contact page — by email, WhatsApp, or the contact form.'
  },
  {
    q: 'Are live classes available?',
    a: "Yes — enrolled students see upcoming live classes, with the meeting link, on their dashboard once a class is scheduled."
  },
  {
    q: 'Will I receive a certificate?',
    a: "Yes. Once you've completed every lesson in a course, a certificate is issued automatically and appears under Certificates on your dashboard, ready to download as a PDF."
  },
  {
    q: 'Can students get personalized learning support?',
    a: 'Yes — teaching is student-friendly and adapts to how each learner is progressing, whether in a structured course or school subject tuition.'
  },
  {
    q: 'How do the courses work?',
    a: "Each course is broken into modules. Every module has video lessons, notes, downloadable worksheets, and often a short quiz. You work through lessons at your own pace and mark each one complete as you finish it."
  },
  {
    q: "Can I retake a quiz if I don't pass?",
    a: "That depends on the quiz — most allow retakes, and you'll see a \"Retake quiz\" option on your result page if so. If a quiz doesn't allow retakes, your best (and only) attempt stands."
  },
  {
    q: 'What if my assignment needs to be resubmitted?',
    a: "You can upload a new file on the assignment page at any time — it replaces your previous submission and goes back into the grading queue."
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
