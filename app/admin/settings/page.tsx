import { createClient } from '@/lib/supabase/server';
import { updateAcademySettings } from './actions';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('academy_settings').select('*').eq('id', 1).maybeSingle();

  const field = (name: string, defaultValue: any) => settings?.[name] ?? defaultValue ?? '';

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-1">Academy Settings</h1>
      <p className="text-ink/60 text-sm mb-8">
        This information appears on the public Contact page — leave anything blank if you're not
        ready to publish it yet.
      </p>

      <form action={updateAcademySettings} className="space-y-8">
        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-4">Contact</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink mb-1">Contact email</label>
              <input
                name="contact_email"
                type="email"
                defaultValue={field('contact_email', '')}
                placeholder="hello@saimaperveenacademy.com"
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">WhatsApp number</label>
              <input
                name="whatsapp_number"
                defaultValue={field('whatsapp_number', '')}
                placeholder="+92 3XX XXXXXXX"
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-4">
            Payment details (shown to students enrolling in paid courses)
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink mb-1">Bank account title</label>
              <input
                name="bank_account_title"
                defaultValue={field('bank_account_title', '')}
                placeholder="Saima Perveen"
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Bank name</label>
              <input
                name="bank_name"
                defaultValue={field('bank_name', '')}
                placeholder="e.g. Meezan Bank"
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Bank account / IBAN number</label>
              <input
                name="bank_account_number"
                defaultValue={field('bank_account_number', '')}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">JazzCash number</label>
              <input
                name="jazzcash_number"
                defaultValue={field('jazzcash_number', '')}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Easypaisa number</label>
              <input
                name="easypaisa_number"
                defaultValue={field('easypaisa_number', '')}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-4">Social links (optional)</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink mb-1">Facebook URL</label>
              <input
                name="facebook_url"
                defaultValue={field('facebook_url', '')}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Instagram URL</label>
              <input
                name="instagram_url"
                defaultValue={field('instagram_url', '')}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">YouTube URL</label>
              <input
                name="youtube_url"
                defaultValue={field('youtube_url', '')}
                className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-ink text-paper px-6 py-3 rounded-sm hover:bg-academy-700 text-sm">
          Save settings
        </button>
      </form>
    </div>
  );
}
