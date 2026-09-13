import ContactForm from '@/components/ContactForm';
import { submitContactMessage } from './actions';

export default function ContactPage() {
  return (
    <div className="container-academy py-16 grid md:grid-cols-2 gap-14 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-ink mb-6">Get in touch</h1>
        <p className="text-ink/70 mb-8">
          Questions about a course, enrollment, or a live class? Send a message and we'll reply as
          soon as possible.
        </p>

        <div className="space-y-4 text-sm mb-10">
          <div>
            <p className="text-ink/50 mb-1">Email</p>
            {/* TODO Saima: replace with your real academy email address */}
            <p className="text-ink">hello@saimaperveenacademy.com</p>
          </div>
          <div>
            <p className="text-ink/50 mb-1">WhatsApp</p>
            {/* TODO Saima: replace with your real WhatsApp number */}
            <p className="text-ink">+92 3XX XXXXXXX</p>
          </div>
        </div>

        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="font-serif text-lg text-ink mb-3">Payment for paid courses</p>
          <p className="text-sm text-ink/70 mb-4">
            After choosing "Enroll now" on a paid course, send payment using the details below,
            then paste your transaction reference on the enrollment screen. Your seat is confirmed
            once it's reviewed — usually within 24 hours.
          </p>
          {/* TODO Saima: replace with your real bank/JazzCash/Easypaisa account details */}
          <dl className="text-sm space-y-2 text-ink/80">
            <div className="flex justify-between">
              <dt>Account title</dt>
              <dd>Saima Perveen</dd>
            </div>
            <div className="flex justify-between">
              <dt>Bank / method</dt>
              <dd>[Bank name / JazzCash / Easypaisa]</dd>
            </div>
            <div className="flex justify-between">
              <dt>Account number</dt>
              <dd>[Add your account/IBAN number]</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-ink mb-6">Send a message</h2>
        <ContactForm onSubmit={submitContactMessage} />
      </div>
    </div>
  );
}
