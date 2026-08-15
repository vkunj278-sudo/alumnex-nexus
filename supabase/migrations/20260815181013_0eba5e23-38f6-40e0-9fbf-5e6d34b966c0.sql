create type public.app_role as enum ('student','alumni','admin');
create type public.visibility_level as enum ('public','students_only','alumni_only','institution_only');
create type public.request_status as enum ('pending','accepted','declined','completed','cancelled');
create type public.opportunity_kind as enum ('job','internship','project','referral');

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins read roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
grant select on public.industries to anon, authenticated;
grant all on public.industries to service_role;
alter table public.industries enable row level security;
create policy "industries public read" on public.industries for select to anon, authenticated using (true);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  industry_id uuid references public.industries(id) on delete set null,
  location text,
  logo_url text,
  is_demo boolean not null default true
);
grant select on public.companies to anon, authenticated;
grant all on public.companies to service_role;
alter table public.companies enable row level security;
create policy "companies public read" on public.companies for select to anon, authenticated using (true);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text
);
grant select on public.skills to anon, authenticated;
grant insert on public.skills to authenticated;
grant all on public.skills to service_role;
alter table public.skills enable row level security;
create policy "skills public read" on public.skills for select to anon, authenticated using (true);
create policy "users add skills" on public.skills for insert to authenticated with check (true);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  role public.app_role not null default 'student',
  full_name text not null default '',
  avatar_url text,
  headline text,
  bio text,
  department text,
  graduation_year int,
  location text,
  career_goal text,
  looking_for text[] not null default '{}',
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  designation text,
  industry_id uuid references public.industries(id) on delete set null,
  years_experience int,
  available_to_mentor boolean not null default false,
  mentorship_focus text[] not null default '{}',
  availability text,
  visibility public.visibility_level not null default 'public',
  allow_mentorship_requests boolean not null default true,
  allow_messages boolean not null default true,
  show_email boolean not null default false,
  show_phone boolean not null default false,
  is_verified boolean not null default false,
  verified_at timestamptz,
  profile_completion int not null default 0,
  onboarding_complete boolean not null default false,
  engagement_score int not null default 0,
  students_helped int not null default 0,
  is_demo boolean not null default false,
  embedding_placeholder jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_role_idx on public.profiles(role);
create index profiles_gradyear_idx on public.profiles(graduation_year);
grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create policy "profiles readable" on public.profiles for select to anon, authenticated using (true);
create policy "insert own profile" on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins update profiles" on public.profiles for update to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.profile_contacts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  user_id uuid,
  email text,
  phone text,
  linkedin_url text,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profile_contacts to authenticated;
grant all on public.profile_contacts to service_role;
alter table public.profile_contacts enable row level security;
create policy "own contacts" on public.profile_contacts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins read contacts" on public.profile_contacts for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.profile_skills (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level text,
  primary key (profile_id, skill_id)
);
grant select on public.profile_skills to anon, authenticated;
grant insert, delete on public.profile_skills to authenticated;
grant all on public.profile_skills to service_role;
alter table public.profile_skills enable row level security;
create policy "profile skills read" on public.profile_skills for select to anon, authenticated using (true);
create policy "manage own profile skills" on public.profile_skills for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));

create table public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  institution text not null,
  degree text,
  field text,
  start_year int,
  end_year int
);
grant select on public.education to anon, authenticated;
grant insert, update, delete on public.education to authenticated;
grant all on public.education to service_role;
alter table public.education enable row level security;
create policy "education read" on public.education for select to anon, authenticated using (true);
create policy "manage own education" on public.education for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));

create table public.employment (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  title text not null,
  location text,
  start_year int,
  end_year int,
  is_current boolean not null default false
);
grant select on public.employment to anon, authenticated;
grant insert, update, delete on public.employment to authenticated;
grant all on public.employment to service_role;
alter table public.employment enable row level security;
create policy "employment read" on public.employment for select to anon, authenticated using (true);
create policy "manage own employment" on public.employment for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));

create table public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  alumni_id uuid not null references public.profiles(id) on delete cascade,
  goal text,
  reason text,
  preferred_schedule text,
  match_score int,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.mentorship_requests to authenticated;
grant select on public.mentorship_requests to anon;
grant all on public.mentorship_requests to service_role;
alter table public.mentorship_requests enable row level security;
create trigger mreq_updated before update on public.mentorship_requests for each row execute function public.set_updated_at();
create policy "mentorship requests readable" on public.mentorship_requests for select to anon, authenticated using (true);
create policy "students create requests" on public.mentorship_requests for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = student_id and p.user_id = auth.uid()));
create policy "participants update requests" on public.mentorship_requests for update to authenticated
  using (exists (select 1 from public.profiles p where p.id in (student_id, alumni_id) and p.user_id = auth.uid()));

create table public.mentorships (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.mentorship_requests(id) on delete set null,
  student_id uuid not null references public.profiles(id) on delete cascade,
  alumni_id uuid not null references public.profiles(id) on delete cascade,
  focus text,
  status public.request_status not null default 'accepted',
  sessions_completed int not null default 0,
  next_session_at timestamptz,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
grant select, insert, update on public.mentorships to authenticated;
grant select on public.mentorships to anon;
grant all on public.mentorships to service_role;
alter table public.mentorships enable row level security;
create policy "mentorships readable" on public.mentorships for select to anon, authenticated using (true);
create policy "participants manage mentorships" on public.mentorships for all to authenticated
  using (exists (select 1 from public.profiles p where p.id in (student_id, alumni_id) and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id in (student_id, alumni_id) and p.user_id = auth.uid()));

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid references public.profiles(id) on delete set null,
  title text not null,
  kind public.opportunity_kind not null default 'job',
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  location text,
  description text,
  required_skills text[] not null default '{}',
  experience_required text,
  stipend_or_salary text,
  apply_deadline date,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.opportunities to anon, authenticated;
grant insert, update, delete on public.opportunities to authenticated;
grant all on public.opportunities to service_role;
alter table public.opportunities enable row level security;
create policy "opportunities read" on public.opportunities for select to anon, authenticated using (true);
create policy "alumni manage own opportunities" on public.opportunities for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = posted_by and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = posted_by and p.user_id = auth.uid()));

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  note text,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (opportunity_id, student_id)
);
grant select, insert, update on public.applications to authenticated;
grant select on public.applications to anon;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "applications readable" on public.applications for select to anon, authenticated using (true);
create policy "students apply" on public.applications for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = student_id and p.user_id = auth.uid()));
create policy "students update own applications" on public.applications for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = student_id and p.user_id = auth.uid()));

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null default now(),
  location text,
  mode text,
  host_profile_id uuid references public.profiles(id) on delete set null,
  capacity int,
  created_at timestamptz not null default now()
);
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "events read" on public.events for select to anon, authenticated using (true);
create policy "hosts manage events" on public.events for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = host_profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = host_profile_id and p.user_id = auth.uid()));

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);
grant select, insert, delete on public.event_registrations to authenticated;
grant select on public.event_registrations to anon;
grant all on public.event_registrations to service_role;
alter table public.event_registrations enable row level security;
create policy "registrations readable" on public.event_registrations for select to anon, authenticated using (true);
create policy "manage own registrations" on public.event_registrations for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select on public.communities to anon, authenticated;
grant insert, update, delete on public.communities to authenticated;
grant all on public.communities to service_role;
alter table public.communities enable row level security;
create policy "communities read" on public.communities for select to anon, authenticated using (true);
create policy "owners manage communities" on public.communities for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = created_by and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = created_by and p.user_id = auth.uid()));

create table public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (community_id, profile_id)
);
grant select, insert, delete on public.community_members to authenticated;
grant select on public.community_members to anon;
grant all on public.community_members to service_role;
alter table public.community_members enable row level security;
create policy "members readable" on public.community_members for select to anon, authenticated using (true);
create policy "manage own membership" on public.community_members for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "read own messages" on public.messages for select to authenticated
  using (exists (select 1 from public.profiles p where p.id in (sender_id, recipient_id) and p.user_id = auth.uid()));
create policy "send messages" on public.messages for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = sender_id and p.user_id = auth.uid()));

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  kind text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "read own notifications" on public.notifications for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));
create policy "update own notifications" on public.notifications for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));
create policy "insert notifications" on public.notifications for insert to authenticated with check (true);

create table public.engagement_scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  score int not null default 0,
  tier text not null default 'active',
  last_active_at timestamptz not null default now(),
  computed_at timestamptz not null default now(),
  unique (profile_id)
);
grant select on public.engagement_scores to anon, authenticated;
grant all on public.engagement_scores to service_role;
alter table public.engagement_scores enable row level security;
create policy "engagement read" on public.engagement_scores for select to anon, authenticated using (true);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign text not null,
  donor_profile_id uuid references public.profiles(id) on delete set null,
  amount numeric(12,2) not null default 0,
  currency text not null default 'INR',
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.donations to anon, authenticated;
grant insert on public.donations to authenticated;
grant all on public.donations to service_role;
alter table public.donations enable row level security;
create policy "donations read" on public.donations for select to anon, authenticated using (true);
create policy "log own donation" on public.donations for insert to authenticated
  with check (donor_profile_id is null or exists (select 1 from public.profiles p where p.id = donor_profile_id and p.user_id = auth.uid()));

create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  method text not null default 'self',
  status text not null default 'pending',
  notes text,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select, insert on public.verifications to authenticated;
grant all on public.verifications to service_role;
alter table public.verifications enable row level security;
create policy "read own verifications" on public.verifications for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));
create policy "admins read verifications" on public.verifications for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "request own verification" on public.verifications for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));