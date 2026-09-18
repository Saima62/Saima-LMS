'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const category = String(formData.get('category') || 'General Question').trim();

  if (!name || !email || !message) {
    throw new Error('Please fill in your name, email, and message.');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').insert({ name, email, message, category });
  if (error) throw new Error(error.message);
}
