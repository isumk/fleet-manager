import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase-admin';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: { full_name: body.full_name },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase
    .from('profiles')
    .update({
      full_name: body.full_name,
      email: body.email,
      role: body.role,
      location_scope: body.location_scope || null,
    })
    .eq('id', data.user.id);

  return NextResponse.json({ ok: true });
}