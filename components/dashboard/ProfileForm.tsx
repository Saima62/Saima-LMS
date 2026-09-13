'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProfileForm({
  userId,
  initialFullName,
  initialPhone,
  initialCountry,
  initialAvatarUrl
}: {
  userId: string;
  initialFullName: string;
  initialPhone: string;
  initialCountry: string;
  initialAvatarUrl: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [country, setCountry] = useState(initialCountry);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large — the limit is 5MB.');
      return;
    }

    setError('');
    setUploadingAvatar(true);
    const extension = file.name.split('.').pop();
    const path = `${userId}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    // Cache-bust so the new image shows immediately even at the same path.
    setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    setUploadingAvatar(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError('');

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone: phone || null, country: country || null, avatar_url: avatarUrl || null })
      .eq('id', userId);

    if (updateError) {
      setStatus('error');
      setError(updateError.message);
      return;
    }

    setStatus('done');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Profile photo" className="w-16 h-16 rounded-full object-cover border border-academy-100" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-academy-50 border border-academy-100 flex items-center justify-center text-ink/30 text-xs">
            No photo
          </div>
        )}
        <label className="text-sm">
          <span className="block text-ink/70 mb-1">Profile photo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            disabled={uploadingAvatar}
            className="text-xs text-ink/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-ink file:text-paper file:text-xs hover:file:bg-academy-700"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm text-ink mb-1">Full name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-1">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div>
        <label className="block text-sm text-ink mb-1">Country</label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === 'done' && <p className="text-sm text-academy-600">Profile updated.</p>}

      <button
        type="submit"
        disabled={status === 'saving' || uploadingAvatar}
        className="bg-ink text-paper px-6 py-2.5 rounded-sm hover:bg-academy-700 disabled:opacity-50 text-sm"
      >
        {status === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
