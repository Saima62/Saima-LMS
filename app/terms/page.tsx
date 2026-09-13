export default function TermsPage() {
  return (
    <div className="container-academy py-16 max-w-2xl prose-sm">
      <h1 className="font-serif text-3xl text-ink mb-2">Terms &amp; Conditions</h1>
      <p className="text-xs text-ink/50 mb-10">Last updated: [add the date you publish this]</p>

      <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
        <div>
          <h2 className="font-serif text-lg text-ink mb-2">1. Enrollment</h2>
          <p>
            Free courses grant access immediately. Paid courses require submitting a payment
            reference, which is manually reviewed before access is granted — typically within 24
            hours.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">2. Course access</h2>
          <p>
            Enrollment gives you access to that course's lessons, materials, quizzes, assignments,
            and any scheduled live classes for as long as your enrollment remains active.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">3. Certificates</h2>
          <p>
            A certificate of completion is issued automatically once every lesson in a course is
            marked complete. Certificates reflect course completion, not a guarantee of any
            particular English proficiency level.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">4. Refunds</h2>
          <p>
            {/* TODO Saima: replace this with your actual refund policy */}
            [Add your refund policy here — for example, whether refunds are available before a
            certain number of lessons are completed, and how a student can request one.]
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">5. Conduct</h2>
          <p>
            Course materials, videos, and worksheets are for your personal learning use and may
            not be redistributed or resold. Live classes are expected to be a respectful learning
            environment for all participants.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">6. Changes</h2>
          <p>
            These terms may be updated from time to time; continued use of the platform after a
            change means you accept the updated terms.
          </p>
        </div>

        <p className="text-xs text-ink/40 border-t border-academy-100 pt-4">
          This page is a general starting template and not legal advice. Have it reviewed by a
          professional before publishing, particularly the refund policy in section 4.
        </p>
      </div>
    </div>
  );
}
