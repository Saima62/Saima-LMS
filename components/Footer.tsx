import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-academy-100 mt-24">
      <div className="container-academy py-12 grid gap-8 md:grid-cols-3 text-sm text-ink/70">
        <div>
          <p className="font-serif text-lg text-ink mb-2">Saima Perveen English Academy</p>
          <p>Spoken, conversational and workplace English — taught one learner at a time.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </div>
        <div className="flex flex-col gap-2">
          <a href="https://saima-perveen-tutor.netlify.app/" target="_blank" rel="noreferrer">
            Main portfolio site
          </a>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="container-academy pb-8 text-xs text-ink/50">
        © {new Date().getFullYear()} Saima Perveen English Academy. All rights reserved.
      </div>
    </footer>
  );
}
