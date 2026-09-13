import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardTabs from '@/components/DashboardTabs';
import ProfileForm from '@/components/dashboard/ProfileForm';
import PasswordForm from '@/components/dashboard/PasswordForm';

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // maybeSingle (not single): a brand-new account may not have its profile
  // row yet (it's created by a database trigger a moment after signup) —
  // this shows an empty, fillable form instead of erroring.
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, country, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <>
      <DashboardTabs />
      <div className="container-academy py-10 max-w-xl">
        <h1 className="font-serif text-3xl text-ink mb-1">Profile Settings</h1>
        <p className="text-ink/60 text-sm mb-10">{user.email}</p>

        <div className="border border-academy-100 bg-white rounded-sm p-6 mb-8">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-4">Your details</p>
          <ProfileForm
            userId={user.id}
            initialFullName={profile?.full_name || (user.user_metadata as any)?.full_name || ''}
            initialPhone={profile?.phone || ''}
            initialCountry={profile?.country || ''}
            initialAvatarUrl={profile?.avatar_url || ''}
          />
        </div>

        <div className="border border-academy-100 bg-white rounded-sm p-6">
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-4">Password</p>
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
