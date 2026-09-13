import { createClient } from '@/lib/supabase/server';
import { markMessageRead } from './actions';

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, created_at, is_read')
    .order('created_at', { ascending: false });

  const unread = (messages || []).filter((m) => !m.is_read);
  const read = (messages || []).filter((m) => m.is_read);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-1">Messages</h1>
      <p className="text-ink/60 text-sm mb-8">Submissions from the Contact page.</p>

      <h2 className="font-serif text-lg text-ink mb-3">Unread ({unread.length})</h2>
      <div className="space-y-4 mb-10">
        {unread.length === 0 && (
          <p className="text-sm text-ink/50 border border-academy-100 bg-white rounded-sm p-5">No new messages.</p>
        )}
        {unread.map((m) => (
          <div key={m.id} className="border border-gold/40 bg-academy-50 rounded-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-ink font-medium">{m.name}</p>
                <p className="text-xs text-ink/50">
                  {m.email} · {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <form action={markMessageRead.bind(null, m.id)}>
                <button className="text-xs text-ink/50 underline shrink-0">Mark as read</button>
              </form>
            </div>
            <p className="text-sm text-ink/80 whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-lg text-ink mb-3">Read</h2>
      <div className="space-y-3">
        {read.map((m) => (
          <div key={m.id} className="border border-academy-100 bg-white rounded-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-ink font-medium">{m.name}</p>
              <p className="text-xs text-ink/50">
                {m.email} · {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-ink/70 whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
        {read.length === 0 && <p className="text-sm text-ink/40">No read messages yet.</p>}
      </div>
    </div>
  );
}
