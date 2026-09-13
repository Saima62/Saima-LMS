'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/requireAdmin';

export async function markMessageRead(messageId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', messageId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/messages');
}
