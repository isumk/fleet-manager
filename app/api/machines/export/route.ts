import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { toCsv } from '@/lib/utils';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('machines').select('machine_number,model,serial_number,location_name,room,status,created_at,updated_at').order('machine_number');
  const csv = toCsv(data ?? []);
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="machines.csv"' } });
}
