import { createClient } from '@/lib/supabase/server';

export default async function VerifyCertificatePage({
  params: paramsPromise
}: {
  params: Promise<{ code: string }>;
}) {
  const params = await paramsPromise;
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('verify_certificate', { p_code: params.code })
    .maybeSingle();

  const found = !error && data;

  return (
    <div className="container-academy py-20 max-w-xl">
      <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Certificate Verification</p>
      <h1 className="font-serif text-3xl text-ink mb-8">Saima Perveen English Academy</h1>

      {found ? (
        <div className="border border-gold/40 bg-academy-50 rounded-sm p-8">
          <p className="text-academy-700 font-medium mb-6">✓ This certificate is valid.</p>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-ink/50">Awarded to</dt>
              <dd className="font-serif text-xl text-ink">{(data as any).student_name}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Course</dt>
              <dd className="text-ink">{(data as any).course_title}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Issued</dt>
              <dd className="text-ink">
                {new Date((data as any).issued_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-ink/50">Certificate ID</dt>
              <dd className="text-ink font-mono text-xs">{(data as any).certificate_code}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="border border-academy-100 bg-white rounded-sm p-8">
          <p className="text-ink font-medium mb-1">Certificate not found.</p>
          <p className="text-sm text-ink/60">
            We couldn't find a certificate matching this ID. Double-check the link, or contact us if you
            believe this is an error.
          </p>
        </div>
      )}
    </div>
  );
}
