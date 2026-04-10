import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const qr = searchParams.get('qr');
  if (!qr) return NextResponse.json({ machine: null });
  const { data: machine } = await supabase.from('machines').select('*').eq('qr_value', qr).maybeSingle();
  const { data: { user } } = await supabase.auth.getUser();
  if (machine) {
    await supabase.from('scan_logs').insert({ machine_id: machine.id, scanned_by: user?.id ?? null, raw_value: qr });
  }
  return NextResponse.json({ machine });
}
