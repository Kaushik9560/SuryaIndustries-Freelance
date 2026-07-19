insert into public.admin_users (user_id, email, display_name)
select id, email, 'Kaushik'
from auth.users
where lower(email) = lower('kaushikofficial1809@gmail.com')
on conflict (user_id) do update
set
  email = excluded.email,
  display_name = excluded.display_name,
  is_active = true;
