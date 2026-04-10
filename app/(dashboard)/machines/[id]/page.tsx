import { createServerSupabase } from '@/lib/supabase-server';
import { MachineDetailClient } from '@/components/AppClient';

export default async function MachinePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const { id } = await params;
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
  const { data: machine } = await supabase.from('machines').select('*').eq('id', id).single();
  return <MachineDetailClient profile={profile} machine={machine} />;
}
