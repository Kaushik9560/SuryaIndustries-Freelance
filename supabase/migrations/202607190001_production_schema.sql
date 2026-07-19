create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  title text not null check (char_length(title) between 2 and 160),
  category text not null check (category in ('seating', 'desks', 'storage')),
  category_name text not null check (char_length(category_name) between 2 and 120),
  description text not null check (char_length(description) between 10 and 300),
  full_description text not null check (char_length(full_description) between 10 and 3000),
  image_url text not null,
  gallery text[] not null default '{}' check (cardinality(gallery) between 1 and 12),
  price_note text not null check (char_length(price_note) between 2 and 100),
  features text[] not null default '{}',
  specs jsonb not null default '[]'::jsonb check (jsonb_typeof(specs) = 'array'),
  is_available boolean not null default true,
  is_visible boolean not null default true,
  is_bestseller boolean not null default false,
  is_clearance boolean not null default false,
  clearance_note text check (
    (is_clearance = false and clearance_note is null)
    or (is_clearance = true and char_length(clearance_note) between 2 and 120)
  ),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  client_request_id uuid not null unique,
  categories text[] not null check (cardinality(categories) between 1 and 8),
  industry text not null check (industry in ('Education', 'Corporate', 'Healthcare', 'Financial', 'Government', 'Commercial')),
  quantity text not null check (quantity in ('1-10', '10-50', '50-100', '100-500', '500+')),
  timeline text not null check (timeline in ('Immediate', '1-3 Months', '3-6 Months', 'Planning')),
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  organization text not null check (char_length(organization) between 2 and 180),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 10 and 20),
  location text not null check (char_length(location) between 2 and 180),
  details text check (details is null or char_length(details) <= 3000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed', 'archived')),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed', 'not_configured')),
  email_error text,
  source_path text not null default '/' check (char_length(source_path) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notify_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  client_request_id uuid not null unique,
  product_id text references public.products(id) on delete set null,
  product_title text not null check (char_length(product_title) between 2 and 180),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) between 10 and 20),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed', 'archived')),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed', 'not_configured')),
  email_error text,
  source_path text not null default '/' check (char_length(source_path) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1,
  updated_at timestamptz not null default now()
);

create index if not exists products_public_order_idx
  on public.products (is_visible, sort_order);
create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);
create index if not exists notify_requests_created_at_idx
  on public.notify_requests (created_at desc);
create index if not exists lead_rate_limits_updated_at_idx
  on public.lead_rate_limits (updated_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at
before update on public.quote_requests
for each row execute function public.set_updated_at();

drop trigger if exists notify_requests_set_updated_at on public.notify_requests;
create trigger notify_requests_set_updated_at
before update on public.notify_requests
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid() and is_active = true
  );
$$;

create or replace function public.consume_public_rate_limit(
  p_fingerprint text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  if p_fingerprint = '' or p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  if random() < 0.01 then
    delete from public.lead_rate_limits
    where updated_at < now() - interval '2 days';
  end if;

  insert into public.lead_rate_limits (
    fingerprint,
    window_started_at,
    request_count,
    updated_at
  )
  values (p_fingerprint, now(), 1, now())
  on conflict (fingerprint) do update
  set
    window_started_at = case
      when public.lead_rate_limits.window_started_at
        <= now() - make_interval(secs => p_window_seconds)
      then now()
      else public.lead_rate_limits.window_started_at
    end,
    request_count = case
      when public.lead_rate_limits.window_started_at
        <= now() - make_interval(secs => p_window_seconds)
      then 1
      else public.lead_rate_limits.request_count + 1
    end,
    updated_at = now()
  returning request_count into current_count;

  return current_count <= p_limit;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.quote_requests enable row level security;
alter table public.notify_requests enable row level security;
alter table public.lead_rate_limits enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.admin_users to authenticated;
grant select, update on public.quote_requests to authenticated;
grant select, update on public.notify_requests to authenticated;
grant all on public.admin_users, public.products, public.quote_requests,
  public.notify_requests, public.lead_rate_limits to service_role;

drop policy if exists "Admins can read their membership" on public.admin_users;
create policy "Admins can read their membership"
on public.admin_users for select to authenticated
using (user_id = auth.uid() and is_active = true);

drop policy if exists "Public can read visible products" on public.products;
create policy "Public can read visible products"
on public.products for select to anon, authenticated
using (is_visible = true or public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete to authenticated
using (public.is_admin());

drop policy if exists "Admins can read quote requests" on public.quote_requests;
create policy "Admins can read quote requests"
on public.quote_requests for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can update quote requests" on public.quote_requests;
create policy "Admins can update quote requests"
on public.quote_requests for update to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can read notify requests" on public.notify_requests;
create policy "Admins can read notify requests"
on public.notify_requests for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can update notify requests" on public.notify_requests;
create policy "Admins can update notify requests"
on public.notify_requests for update to authenticated
using (public.is_admin()) with check (public.is_admin());

revoke all on function public.consume_public_rate_limit(text, integer, integer) from public;
revoke all on function public.consume_public_rate_limit(text, integer, integer) from anon;
revoke all on function public.consume_public_rate_limit(text, integer, integer) from authenticated;
grant execute on function public.consume_public_rate_limit(text, integer, integer) to service_role;

insert into public.products (
  id, title, category, category_name, description, full_description,
  image_url, gallery, price_note, features, specs, is_available,
  is_visible, is_bestseller, is_clearance, clearance_note, sort_order
)
values
(
  'office-chairs-mesh',
  'Ergonomic Mesh Office Chair',
  'seating',
  'Ergonomic Office Chairs',
  'High-back mesh chair with adaptive lumbar & headrest support.',
  'Engineered for intensive 8+ hour workday comfort, this ergonomic high-back mesh chair features an adaptive lumbar system, breathable Korean mesh backrest, pneumatic height adjustment, and a heavy-duty chrome star base.',
  '/pics/kursi.jpeg',
  array['/pics/kursi.jpeg', '/pics/ergonomic_mesh_headrest_side.jpeg', '/pics/executive_mesh_chrome.jpeg'],
  'Direct Factory Pricing',
  array['Breathable high-tension mesh backrest', 'Adaptive dual-zone lumbar support', '3D adjustable armrests with soft PU padding', 'Heavy-duty class-4 pneumatic gas lift', 'Anti-scratch nylon casters with 360-degree swivel'],
  '[{"label":"Dimensions","value":"W: 65cm x D: 60cm x H: 115-125cm"},{"label":"Base Finish","value":"Polished Chrome / Nylon Star Base"},{"label":"Weight Capacity","value":"135 kg"},{"label":"Warranty","value":"2-Year Manufacturer Warranty"},{"label":"Origin","value":"Peenya Industrial Hub, Bengaluru"}]'::jsonb,
  true, true, true, true, '25% OFF - Floor Models', 10
),
(
  'executive-boss-leather',
  'Boss Leather Executive Chair',
  'seating',
  'Executive Boss Chairs',
  'Luxury PU leather boss chair with multi-lock recline mechanism.',
  'Designed for executive suites and leadership desks, this premium boss chair combines thick high-density molded foam padding, hand-stitched premium PU leather, heavy-duty aluminium armrests, and a multi-lock tilt mechanism.',
  '/pics/executive_boss_leather_black.jpeg',
  array['/pics/executive_boss_leather_black.jpeg', '/pics/executive_boss_leather_brown.jpeg'],
  'Premium Grade',
  array['Premium water-resistant PU leather upholstery', 'Multi-position tilt lock mechanism with tension control', 'High-density molded foam seat cushion', 'Cast aluminium armrests with padded leather caps', 'Class-4 heavy duty cylinder mechanism'],
  '[{"label":"Dimensions","value":"W: 70cm x D: 65cm x H: 120-130cm"},{"label":"Base Finish","value":"Die-cast Polished Aluminium"},{"label":"Weight Capacity","value":"150 kg"},{"label":"Warranty","value":"2-Year Manufacturer Warranty"},{"label":"Origin","value":"Bengaluru, Karnataka"}]'::jsonb,
  true, true, true, false, null, 20
),
(
  'waiting-area-seating',
  'Heavy-Duty Waiting Area Row Seating',
  'seating',
  'Waiting Area Seating',
  'Durable 3-seater steel waiting row for hospitals, banks, and public spaces.',
  'Built specifically for high-traffic public institutions including hospital reception lobbies, airport corridors, municipal offices, and bank branches. Features heavy-gauge perforated steel seats with anti-rust silver powder coating.',
  '/waiting_area.png',
  array['/waiting_area.png'],
  'Institutional Volume Pricing',
  array['Heavy-gauge cold-rolled perforated steel seat pan', 'Anti-bacterial scratch-resistant silver powder coat', 'Ergonomic curved backrest angle for public comfort', 'Reinforced steel crossbar beam', 'Floor anchor mounting holes for safety'],
  '[{"label":"Dimensions","value":"W: 175cm x D: 65cm x H: 80cm"},{"label":"Frame Finish","value":"Thermoset Metallic Silver Powder Coat"},{"label":"Seating Capacity","value":"3 Persons (Expandable to 4-Seater)"},{"label":"Warranty","value":"2-Year Heavy Duty Warranty"},{"label":"Origin","value":"Bengaluru, Karnataka"}]'::jsonb,
  true, true, false, false, null, 30
),
(
  'student-desk-modern',
  'Modern Individual Student Desk & Chair Set',
  'desks',
  'Modern Student Desks',
  'Ergonomic individual student desk with writing tablet & steel frame.',
  'Designed for contemporary classrooms, lecture halls, and coaching institutes. Combines a solid hardwood-grain scratch-resistant writing desktop tablet with an ergonomic mesh backrest chair and under-seat book rack.',
  '/pics/sdm.png',
  array['/pics/sdm.png', '/pics/student_desk_modern.png'],
  'Special Institutional Contracts',
  array['Solid hardwood laminate writing pad with pencil groove', 'Heavy-duty powder-coated tubular steel frame', 'Ergonomic contoured seat with high-density foam', 'Built-in under-seat wire basket for books & bags', 'Leveling rubber feet to prevent floor scratches'],
  '[{"label":"Desktop Size","value":"55cm x 35cm x 1.8cm thickness"},{"label":"Frame Material","value":"1.2mm Gauge Tubular Mild Steel"},{"label":"Target Age","value":"High School, College & Professional Training"},{"label":"Warranty","value":"2-Year Institutional Warranty"},{"label":"Origin","value":"Peenya Industrial Hub, Bengaluru"}]'::jsonb,
  true, true, true, true, '20% OFF - Clearance', 40
),
(
  'rhino-digital-safe',
  'Rhino Advanced Digital Security Safe',
  'storage',
  'Safes, Steel Lockers & Storage',
  'Heavy-gauge electronic security safe with digital numeric keypad.',
  'Engineered for commercial offices, hotel rooms, institutional vaults, and secure record storage. Features an electronic keypad with motorized dual steel locking bolts, override master key, and solid cold-rolled steel construction.',
  '/pics/digital_safe_rhino_yellow.jpeg',
  array['/pics/digital_safe_rhino_yellow.jpeg', '/pics/digital_safe_front.jpeg', '/pics/digital_safe_dimensions.jpeg'],
  'High Security & Bulk Supply',
  array['Motorized dual solid steel locking bolts (20mm thickness)', 'Digital illuminated LED numeric keypad', 'Emergency mechanical override key lock', 'Heavy-gauge drill-resistant steel casing', 'Pre-drilled anchor holes for floor & wall mounting'],
  '[{"label":"Dimensions","value":"H: 50cm x W: 35.5cm x D: 33cm"},{"label":"Capacity","value":"45 Liters"},{"label":"Weight","value":"20.9 kg"},{"label":"Warranty","value":"2-Year Direct Warranty"},{"label":"Origin","value":"Karnataka"}]'::jsonb,
  true, true, true, true, '15% OFF - Bulk Clearance', 50
),
(
  'red-coffer-safe',
  'Red Coffer Premium Vault Safe',
  'storage',
  'Safes, Steel Lockers & Storage',
  'Compact heavy-duty coffer safe for administrative record protection.',
  'Designed for high-security document storage, cash vaults, and administrative record keeping. Features a 10x stronger steel body than wooden cupboards, precision gold lever mechanism, and dual key lock system.',
  '/pics/coffer_safe_red_room.jpeg',
  array['/pics/coffer_safe_red_room.jpeg', '/pics/coffer_safe_red_front.jpeg', '/pics/coffer_safe_red_premium.jpeg'],
  'Clearance Batch',
  array['10X stronger than wooden cupboards', 'Dual key mechanical locking mechanism', 'High-durability thermoset crimson red finish with brass trim', 'Top lockable inner compartment', 'Fire-retardant heavy steel double wall construction'],
  '[{"label":"Dimensions","value":"H: 45cm x W: 50cm x D: 40cm"},{"label":"Lock Type","value":"Dual Key & Lever Mechanical Lock"},{"label":"Warranty","value":"2-Year Full Warranty"},{"label":"Origin","value":"Karnataka"}]'::jsonb,
  false, true, false, true, '30% OFF - Clearance Batch', 60
)
on conflict (id) do nothing;

-- After creating an Auth user in the Supabase dashboard, authorize it once:
-- insert into public.admin_users (user_id, email, display_name)
-- select id, email, 'Owner' from auth.users where email = 'owner@example.com';
