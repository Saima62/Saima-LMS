'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MAX_SIZE_MB = 20;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'zip', 'mp3', 'mp4'];

export default function AssignmentSubmitForm({
  assignmentId,
  onRecord
}: {
  assignmentId: string;
  onRecord: (fileUrl: string) => Promise<void>;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error' | 'done'>('idle');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setFileName(file.name);

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError(`That file type isn't supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}.`);
      setStatus('error');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large — the limit is ${MAX_SIZE_MB}MB.`);
      setStatus('error');
      return;
    }

    setStatus('uploading');

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Path is scoped to the student's own folder — Storage policies only let
    // a student read/write inside their own auth.uid() folder (or an admin).
    const path = `${user.id}/${assignmentId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('assignment-submissions')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setStatus('error');
      return;
    }

    // Bucket is private, so a long-lived signed URL is generated once at
    // submission time and stored — this is what the admin grading page opens.
    const { data: signed, error: signError } = await supabase.storage
      .from('assignment-submissions')
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);

    if (signError || !signed?.signedUrl) {
      setError(signError?.message || 'Could not generate a link to your file.');
      setStatus('error');
      return;
    }

    try {
      await onRecord(signed.signedUrl);
      setStatus('done');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Upload succeeded but saving the submission failed. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm text-ink/70 block mb-2">
          {ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(', ')} — up to {MAX_SIZE_MB}MB
        </span>
        <input
          type="file"
          onChange={handleFile}
          disabled={status === 'uploading'}
          className="text-sm text-ink/80 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-ink file:text-paper file:text-sm hover:file:bg-academy-700"
        />
      </label>
      {status === 'uploading' && <p className="text-sm text-ink/60">Uploading {fileName}…</p>}
      {status === 'done' && <p className="text-sm text-academy-600">Submitted successfully.</p>}
      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
