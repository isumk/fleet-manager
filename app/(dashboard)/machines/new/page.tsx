import { createServerSupabase } from '@/lib/supabase-server';
import { AddMachineClient } from '@/components/AppClient';

export default async function NewMachinePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
  return <AddMachineClient profile={profile} />;
}
