export default function PrivacyPage() {
  return (
    <div className="container-academy py-16 max-w-2xl prose-sm">
      <h1 className="font-serif text-3xl text-ink mb-2">Privacy Policy</h1>
      <p className="text-xs text-ink/50 mb-10">Last updated: [add the date you publish this]</p>

      <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
        <p>
          Saima Perveen English Academy ("we", "us") operates this learning platform. This policy
          explains what information we collect from students and how it's used.
        </p>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">Information we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account information: your name, email address, and password (handled securely by our authentication provider).</li>
            <li>Course activity: enrollments, lesson progress, quiz results, and assignment submissions.</li>
            <li>Payment references: for paid courses, the transaction reference you submit for manual verification. We do not collect or store card numbers.</li>
            <li>Any files you upload, such as assignment submissions or a profile photo.</li>
            <li>Messages you send us through the Contact page.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">How we use it</h2>
          <p>
            Your information is used to operate your account, track your course progress, issue
            certificates, communicate with you about your enrollment, and improve the academy's
            courses. We do not sell your information.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">Where it's stored</h2>
          <p>
            Data is stored with our database and authentication provider, Supabase, using
            industry-standard security practices including encrypted connections and
            access-controlled database rules.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">Your rights</h2>
          <p>
            You can update your profile information at any time from your account settings, or
            contact us to request access to, correction of, or deletion of your data.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg text-ink mb-2">Contact</h2>
          <p>Questions about this policy can be sent through the Contact page.</p>
        </div>

        <p className="text-xs text-ink/40 border-t border-academy-100 pt-4">
          This page is a general starting template and not legal advice. Before publishing,
          have it reviewed against the data-protection laws that apply to you and your
          students (for example, Pakistan's Personal Data Protection framework and any law
          that applies where your students are based).
        </p>
      </div>
    </div>
  );
}
