-- ===========================================================================
-- Esquema de la base de datos de "Lista Compra Masiera"
-- ---------------------------------------------------------------------------
-- Pegalo en el SQL Editor de Supabase si quieres recrear el proyecto desde
-- cero. Crea la tabla unica `items`, sus indices, activa RLS con politicas
-- por usuario y anade la tabla a la publicacion de Realtime.
-- ===========================================================================

-- Tabla unica de la lista (cada fila es un producto / "DJ" del line-up).
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null check (char_length(trim(nombre)) between 1 and 120),
  cantidad integer not null default 1 check (cantidad >= 1 and cantidad <= 999),
  comprado boolean not null default false,
  orden double precision not null default 0,
  created_at timestamptz not null default now()
);

-- Indices para filtrar / ordenar por usuario.
create index if not exists items_user_id_idx on public.items (user_id);
create index if not exists items_user_orden_idx on public.items (user_id, orden);

-- Realtime necesita la fila completa para updates/deletes.
alter table public.items replica identity full;

-- Seguridad a nivel de fila (RLS): cada usuario solo ve y maneja lo suyo.
alter table public.items enable row level security;

drop policy if exists "items_select_own" on public.items;
create policy "items_select_own" on public.items
  for select using (auth.uid() = user_id);

drop policy if exists "items_insert_own" on public.items;
create policy "items_insert_own" on public.items
  for insert with check (auth.uid() = user_id);

drop policy if exists "items_update_own" on public.items;
create policy "items_update_own" on public.items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "items_delete_own" on public.items;
create policy "items_delete_own" on public.items
  for delete using (auth.uid() = user_id);

-- Anade la tabla a la publicacion de Realtime (sincronizacion instantanea).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'items'
  ) then
    alter publication supabase_realtime add table public.items;
  end if;
end $$;
