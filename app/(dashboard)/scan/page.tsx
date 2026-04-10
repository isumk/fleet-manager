import { createServerSupabase } from '@/lib/supabase-server';
import { ScanClient } from '@/components/AppClient';

export default async function ScanPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
  return <ScanClient profile={profile} />;
}
