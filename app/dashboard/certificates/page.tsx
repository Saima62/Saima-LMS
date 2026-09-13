import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardTabs from '@/components/DashboardTabs';

export default async function CertificatesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Belt-and-braces: middleware already blocks logged-out visitors from
  // /dashboard, but if a session cookie is ever missing on this request,
  // redirect instead of crashing on user.id below.
  if (!user) {
    redirect('/login');
  }

  const { data: certificates } = await supabase
    .from('certificates')
    .select('id, certificate_code, issued_at, course:courses(title)')
    .eq('student_id', user.id)
    .order('issued_at', { ascending: false });

  return (
    <>
      <DashboardTabs />
      <div className="container-academy py-10 max-w-3xl">
      <h1 className="font-serif text-3xl text-ink mb-1">Certificates</h1>
      <p className="text-ink/60 text-sm mb-8">Every certificate you've earned by completing a course.</p>

      {(!certificates || certificates.length === 0) && (
        <p className="text-sm text-ink/50 border border-academy-100 bg-white rounded-sm p-6">
          You haven't earned a certificate yet — finish every lesson in a course to have one issued
          automatically.
        </p>
      )}

      <div className="space-y-4">
        {(certificates || []).map((cert: any) => (
          <div
            key={cert.id}
            className="border border-academy-100 bg-white rounded-sm p-6 flex items-center justify-between gap-4 flex-wrap"
          >
            <div>
              <p className="font-serif text-lg text-ink">{cert.course?.title}</p>
              <p className="text-xs text-ink/50 mt-1">
                Issued {new Date(cert.issued_at).toLocaleDateString()} · {cert.certificate_code}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/verify/${cert.certificate_code}`}
                target="_blank"
                className="text-sm text-ink/60 underline"
              >
                Verification page
              </Link>
              <a
                href={`/api/certificates/${cert.id}`}
                className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-academy-700"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
