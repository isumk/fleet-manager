create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null unique,
  role text not null default 'user' check (role in ('admin', 'user')),
  location_scope text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  machine_number text not null unique,
  model text not null,
  serial_number text not null,
  room text not null,
  location_name text not null,
  status text not null check (status in ('working', 'not_working', 'inactive', 'active')),
  purchase_date date,
  notes text,
  maintenance_due_date date,
  qr_value text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id)
);

create table if not exists public.scan_logs (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid references public.machines(id) on delete cascade,
  scanned_by uuid references auth.users(id),
  raw_value text not null,
  scanned_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_touch_updated_at on public.machines;
create trigger trg_touch_updated_at before update on public.machines for each row execute procedure public.touch_updated_at();

create or replace function public.log_machine_changes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
    values (auth.uid(), 'create', 'machine', new.id::text, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
    values (auth.uid(), 'update', 'machine', new.id::text, jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new)));
    return new;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_machine_audit_insert on public.machines;
create trigger trg_machine_audit_insert after insert on public.machines for each row execute procedure public.log_machine_changes();

drop trigger if exists trg_machine_audit_update on public.machines;
create trigger trg_machine_audit_update after update on public.machines for each row execute procedure public.log_machine_changes();

alter table public.profiles enable row level security;
alter table public.machines enable row level security;
alter table public.scan_logs enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "profiles select own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles admin update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
create policy "machines read authenticated" on public.machines for select using (auth.uid() is not null);
create policy "machines write authenticated" on public.machines for insert with check (auth.uid() is not null);
create policy "machines update authenticated" on public.machines for update using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "scan logs authenticated" on public.scan_logs for insert with check (auth.uid() is not null);
create policy "scan logs read authenticated" on public.scan_logs for select using (auth.uid() is not null);
create policy "audit logs read authenticated" on public.audit_logs for select using (auth.uid() is not null);
