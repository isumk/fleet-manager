import { createServerSupabase } from '@/lib/supabase-server';
import { UsersClient } from '@/components/AppClient';

export default async function UsersPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return <UsersClient profile={profile} users={users ?? []} />;
}
