import ContactForm from '@/components/ContactForm';
import { createClient } from '@/lib/supabase/server';
import { submitContactMessage } from './actions';

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('academy_settings').select('*').eq('id', 1).maybeSingle();

  const hasPaymentDetails =
    settings?.bank_account_title || settings?.bank_account_number || settings?.jazzcash_number || settings?.easypaisa_number;

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
            <p className="text-ink">{settings?.contact_email || 'Coming soon'}</p>
          </div>
          <div>
            <p className="text-ink/50 mb-1">WhatsApp</p>
            {settings?.whatsapp_number ? (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-ink underline"
              >
                {settings.whatsapp_number}
              </a>
            ) : (
              <p className="text-ink">Coming soon</p>
            )}
          </div>
        </div>

        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="font-serif text-lg text-ink mb-3">Payment for paid courses</p>
          <p className="text-sm text-ink/70 mb-4">
            After choosing "Enroll now" on a paid course, send payment using the details below,
            then paste your transaction reference on the enrollment screen. Your seat is confirmed
            once it's reviewed — usually within 24 hours.
          </p>
          {hasPaymentDetails ? (
            <dl className="text-sm space-y-2 text-ink/80">
              {settings?.bank_account_title && (
                <div className="flex justify-between">
                  <dt>Account title</dt>
                  <dd>{settings.bank_account_title}</dd>
                </div>
              )}
              {settings?.bank_name && (
                <div className="flex justify-between">
                  <dt>Bank</dt>
                  <dd>{settings.bank_name}</dd>
                </div>
              )}
              {settings?.bank_account_number && (
                <div className="flex justify-between">
                  <dt>Account / IBAN</dt>
                  <dd>{settings.bank_account_number}</dd>
                </div>
              )}
              {settings?.jazzcash_number && (
                <div className="flex justify-between">
                  <dt>JazzCash</dt>
                  <dd>{settings.jazzcash_number}</dd>
                </div>
              )}
              {settings?.easypaisa_number && (
                <div className="flex justify-between">
                  <dt>Easypaisa</dt>
                  <dd>{settings.easypaisa_number}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-ink/50">
              Payment details will be published here shortly — please contact us directly for now.
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-ink mb-6">Send a message</h2>
        <ContactForm onSubmit={submitContactMessage} />
      </div>
    </div>
  );
}
