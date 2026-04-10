import { createServerSupabase } from '@/lib/supabase-server';
import { DashboardClient } from '@/components/AppClient';

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
  let query = supabase.from('machines').select('*').order('updated_at', { ascending: false });
  if (profile?.role !== 'admin' && profile?.location_scope) query = query.eq('location_name', profile.location_scope);
  const { data: machines } = await query;
  return <DashboardClient profile={profile} initialMachines={machines ?? []} />;
}
