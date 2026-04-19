-- ============================================================
-- Plumber Servicios SPA — Supabase Setup Script
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. TABLA PROYECTOS
-- ============================================================
create table if not exists proyectos (
  id          bigserial primary key,
  titulo      text not null,
  categoria   text not null,
  ubicacion   text not null,
  descripcion text not null,
  descripcion_larga  text,
  imagen_principal   text not null default '',
  galeria            text[] default '{}',
  created_at  timestamptz default now()
);

-- Row-Level Security
alter table proyectos enable row level security;

-- Lectura pública (home + /proyectos)
create policy "proyectos_select_public" on proyectos
  for select using (true);

-- Escritura solo para usuarios autenticados (admin)
create policy "proyectos_insert_auth" on proyectos
  for insert with check (auth.role() = 'authenticated');

create policy "proyectos_update_auth" on proyectos
  for update using (auth.role() = 'authenticated');

create policy "proyectos_delete_auth" on proyectos
  for delete using (auth.role() = 'authenticated');


-- 2. STORAGE BUCKET PARA IMÁGENES
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('proyectos-imagenes', 'proyectos-imagenes', true)
  on conflict (id) do nothing;

-- Lectura pública de imágenes
create policy "storage_select_public" on storage.objects
  for select using (bucket_id = 'proyectos-imagenes');

-- Subida solo para usuarios autenticados
create policy "storage_insert_auth" on storage.objects
  for insert with check (
    bucket_id = 'proyectos-imagenes'
    and auth.role() = 'authenticated'
  );

-- Eliminación solo para usuarios autenticados
create policy "storage_delete_auth" on storage.objects
  for delete using (
    bucket_id = 'proyectos-imagenes'
    and auth.role() = 'authenticated'
  );
