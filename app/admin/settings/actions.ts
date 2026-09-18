'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function updateAcademySettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  const field = (name: string) => {
    const value = String(formData.get(name) || '').trim();
    return value === '' ? null : value;
  };

  const { error } = await supabase
    .from('academy_settings')
    .update({
      contact_email: field('contact_email'),
      whatsapp_number: field('whatsapp_number'),
      bank_account_title: field('bank_account_title'),
      bank_name: field('bank_name'),
      bank_account_number: field('bank_account_number'),
      jazzcash_number: field('jazzcash_number'),
      easypaisa_number: field('easypaisa_number'),
      facebook_url: field('facebook_url'),
      instagram_url: field('instagram_url'),
      youtube_url: field('youtube_url'),
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/settings');
  revalidatePath('/contact');
}
