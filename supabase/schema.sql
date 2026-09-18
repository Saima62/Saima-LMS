-- ============================================================
-- Saima Perveen English Academy — LMS Database Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- PROFILES (extends Supabase auth.users)
-- ------------------------------------------------------------
create type user_role as enum ('student', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'student',
  avatar_url text,
  phone text,
  country text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Student'), 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ------------------------------------------------------------
-- COURSES
-- ------------------------------------------------------------
create type course_level as enum ('beginner', 'intermediate', 'advanced', 'all_levels');
create type course_status as enum ('draft', 'published', 'archived');

create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  cover_image_url text,
  price numeric(10,2) not null default 0,          -- 0 = free course
  is_free boolean generated always as (price = 0) stored,
  duration_weeks int,
  level course_level not null default 'all_levels',
  learning_objectives text[],                       -- array of bullet points
  status course_status not null default 'draft',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MODULES (Weeks) -> LESSONS
-- ------------------------------------------------------------
create table modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,               -- e.g. "Week 1: Introduction & Basic Conversation"
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references modules(id) on delete cascade,
  title text not null,
  video_url text,                    -- YouTube/Vimeo/Supabase Storage URL
  notes_html text,                   -- rich text lesson notes
  pdf_url text,                      -- worksheet / resource file
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- QUIZZES
-- ------------------------------------------------------------
create type question_type as enum ('multiple_choice', 'true_false');

create table quizzes (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references lessons(id) on delete cascade,
  module_id uuid references modules(id) on delete cascade,
  title text not null,
  passing_percentage int not null default 70,
  allow_retake boolean not null default true,
  created_at timestamptz not null default now()
);

create table quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question_type question_type not null default 'multiple_choice',
  question_text text not null,
  options jsonb not null,             -- [{id:"a", text:"..."}, ...]
  correct_option_id text not null,
  position int not null default 0
);

create table quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  answers jsonb not null,             -- {question_id: chosen_option_id}
  score int not null,                 -- percentage
  passed boolean not null,
  attempted_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ASSIGNMENTS
-- ------------------------------------------------------------
create type submission_status as enum ('not_submitted', 'submitted', 'graded');

create table assignments (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references modules(id) on delete cascade,
  title text not null,
  instructions text,
  due_date date,
  created_at timestamptz not null default now()
);

create table assignment_submissions (
  id uuid primary key default uuid_generate_v4(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  file_url text,
  status submission_status not null default 'submitted',
  grade text,
  feedback text,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz
);

-- ------------------------------------------------------------
-- ENROLLMENTS & PROGRESS
-- ------------------------------------------------------------
create type enrollment_status as enum ('pending_payment', 'active', 'completed', 'rejected');

create table enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  status enrollment_status not null default 'active',
  payment_reference text,             -- screenshot/ref for manual payment
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (student_id, course_id)
);

create table lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (student_id, lesson_id)
);

-- ------------------------------------------------------------
-- CERTIFICATES
-- ------------------------------------------------------------
create table certificates (
  id uuid primary key default uuid_generate_v4(),
  certificate_code text not null unique,   -- e.g. SPEA-2026-000123
  student_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  issued_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- LIVE CLASSES
-- ------------------------------------------------------------
create table live_classes (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  class_date date not null,
  class_time text not null,
  meeting_link text not null,          -- only shown to enrolled students, never public
  instructions text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  type text not null,                  -- 'enrollment' | 'quiz_result' | 'assignment' | 'live_class' | 'certificate' | 'announcement'
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;
alter table assignments enable row level security;
alter table assignment_submissions enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table certificates enable row level security;
alter table live_classes enable row level security;
alter table notifications enable row level security;

-- Helper: is the current user an admin?
create function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Profiles: everyone can read their own, admin can read/write all
create policy "profiles_self_select" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles_self_update" on profiles for update using (id = auth.uid() or is_admin());

-- Published courses are public; admin sees everything
create policy "courses_public_read" on courses for select using (status = 'published' or is_admin());
create policy "courses_admin_write" on courses for all using (is_admin());

create policy "modules_public_read" on modules for select using (true);
create policy "modules_admin_write" on modules for all using (is_admin());

-- Lessons: only visible to enrolled students (or admin)
create policy "lessons_enrolled_read" on lessons for select using (
  is_admin() or exists (
    select 1 from enrollments e
    join modules m on m.id = lessons.module_id
    where e.course_id = m.course_id and e.student_id = auth.uid() and e.status in ('active','completed')
  )
);
create policy "lessons_admin_write" on lessons for all using (is_admin());

-- Enrollments: student sees own, admin sees all
create policy "enrollments_self" on enrollments for select using (student_id = auth.uid() or is_admin());
create policy "enrollments_self_insert" on enrollments for insert with check (student_id = auth.uid());
create policy "enrollments_admin_update" on enrollments for update using (is_admin());

-- Progress: student manages their own rows only
create policy "progress_self" on lesson_progress for all using (student_id = auth.uid() or is_admin());

-- Quiz metadata (title, passing %) is fine to read publicly once enrolled-gated
-- lesson access already governs discovery; admin manages quizzes fully.
create policy "quizzes_read" on quizzes for select using (true);
create policy "quizzes_admin_write" on quizzes for all using (is_admin());

-- Quiz questions hold the correct answer, so only admins may read/write the
-- table directly. Students take quizzes via the quiz_questions_public view
-- (no correct_option_id) and submit answers through submit_quiz_attempt(),
-- which grades entirely inside the database — the correct answers never
-- have to leave the server to check a submission.
create policy "quiz_questions_admin_read" on quiz_questions for select using (is_admin());
create policy "quiz_questions_admin_write" on quiz_questions for insert with check (is_admin());
create policy "quiz_questions_admin_update" on quiz_questions for update using (is_admin());
create policy "quiz_questions_admin_delete" on quiz_questions for delete using (is_admin());
create policy "quiz_attempts_self" on quiz_attempts for all using (student_id = auth.uid() or is_admin());

-- Assignments
create policy "assignments_read" on assignments for select using (true);
create policy "assignments_admin_write" on assignments for all using (is_admin());
create policy "submissions_self" on assignment_submissions for select using (student_id = auth.uid() or is_admin());
create policy "submissions_self_insert" on assignment_submissions for insert with check (student_id = auth.uid());
create policy "submissions_admin_update" on assignment_submissions for update using (is_admin());

-- Certificates: student sees own, admin issues
create policy "certificates_self" on certificates for select using (student_id = auth.uid() or is_admin());
create policy "certificates_admin_write" on certificates for insert with check (is_admin());

-- Live classes: only enrolled students (never public) + admin
create policy "live_classes_enrolled" on live_classes for select using (
  is_admin() or exists (
    select 1 from enrollments e where e.course_id = live_classes.course_id
    and e.student_id = auth.uid() and e.status in ('active','completed')
  )
);
create policy "live_classes_admin_write" on live_classes for all using (is_admin());

-- Notifications: student sees own
create policy "notifications_self" on notifications for select using (student_id = auth.uid() or is_admin());
create policy "notifications_admin_insert" on notifications for insert with check (is_admin());
create policy "notifications_self_update" on notifications for update using (student_id = auth.uid());

-- ============================================================
-- QUIZ TAKING: safe view + server-side grading
-- ============================================================

-- Students read questions/options through this view, never the base table —
-- it deliberately omits correct_option_id.
create view quiz_questions_public as
  select id, quiz_id, question_type, question_text, options, position
  from quiz_questions;

grant select on quiz_questions_public to authenticated;

-- Grades a quiz attempt entirely inside the database and stores it.
-- The correct answers are compared here, server-side, and never sent to
-- the browser at any point in the flow.
create or replace function submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns table(score int, passed boolean, attempt_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student uuid := auth.uid();
  v_total int;
  v_correct int;
  v_score int;
  v_passing int;
  v_allow_retake boolean;
  v_passed boolean;
  v_attempt_id uuid;
begin
  if v_student is null then
    raise exception 'Not authenticated';
  end if;

  select passing_percentage, allow_retake into v_passing, v_allow_retake
  from quizzes where id = p_quiz_id;

  if v_passing is null then
    raise exception 'Quiz not found';
  end if;

  if not v_allow_retake and exists (
    select 1 from quiz_attempts where quiz_id = p_quiz_id and student_id = v_student
  ) then
    raise exception 'Retakes are not allowed for this quiz';
  end if;

  select count(*) into v_total from quiz_questions where quiz_id = p_quiz_id;

  select count(*) into v_correct
  from quiz_questions q
  where q.quiz_id = p_quiz_id
    and (p_answers ->> q.id::text) = q.correct_option_id;

  v_score := case when v_total > 0 then round((v_correct::numeric / v_total) * 100) else 0 end;
  v_passed := v_score >= v_passing;

  insert into quiz_attempts (quiz_id, student_id, answers, score, passed)
  values (p_quiz_id, v_student, p_answers, v_score, v_passed)
  returning id into v_attempt_id;

  return query select v_score, v_passed, v_attempt_id;
end;
$$;

grant execute on function submit_quiz_attempt(uuid, jsonb) to authenticated;

-- ============================================================
-- PHASE 3 ADDITIONS: quiz result review + assignment file storage
-- (If you already ran the schema above in Phase 1/2, just run this
-- section on its own — everything above already exists.)
-- ============================================================

-- Returns each question in an attempt's quiz plus whether the student got it
-- right — but never the correct_option_id itself, so a failed attempt can
-- still be retaken fairly without leaking the answer key.
create or replace function get_quiz_attempt_review(p_attempt_id uuid)
returns table(
  question_id uuid,
  question_text text,
  chosen_option_id text,
  is_correct boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller uuid := auth.uid();
  v_quiz_id uuid;
  v_owner uuid;
  v_answers jsonb;
begin
  select quiz_id, student_id, answers into v_quiz_id, v_owner, v_answers
  from quiz_attempts where id = p_attempt_id;

  if v_owner is null then
    raise exception 'Attempt not found';
  end if;
  if v_owner <> v_caller and not is_admin() then
    raise exception 'Not authorized';
  end if;

  return query
  select
    q.id,
    q.question_text,
    v_answers ->> q.id::text,
    (v_answers ->> q.id::text) = q.correct_option_id
  from quiz_questions q
  where q.quiz_id = v_quiz_id
  order by q.position;
end;
$$;

grant execute on function get_quiz_attempt_review(uuid) to authenticated;

-- Assignment submissions bucket (private — files are only reachable via a
-- signed URL, never a public path).
insert into storage.buckets (id, name, public)
values ('assignment-submissions', 'assignment-submissions', false)
on conflict (id) do nothing;

-- A student may only read/write inside a folder named after their own
-- auth.uid(), e.g. "3fa2.../assignment-id/file.pdf". Admin can read all
-- (used when generating/reviewing links from the grading dashboard).
create policy "submissions_upload_own_folder" on storage.objects
  for insert
  with check (
    bucket_id = 'assignment-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "submissions_read_own_or_admin" on storage.objects
  for select
  using (
    bucket_id = 'assignment-submissions'
    and ((storage.foldername(name))[1] = auth.uid()::text or is_admin())
  );

-- ============================================================
-- PHASE 4 ADDITIONS: certificate issuance + public verification
-- (If you already ran the sections above, just run this section —
-- everything before it already exists in your database.)
-- ============================================================

create sequence if not exists certificate_seq start 1;

-- Called by the student's own session the moment a course is completed
-- (see toggleLessonComplete). Idempotent: calling it again for a course
-- that's already been issued a certificate just returns the existing one.
create or replace function issue_certificate_if_eligible(p_course_id uuid)
returns table(certificate_id uuid, certificate_code text, already_existed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student uuid := auth.uid();
  v_status enrollment_status;
  v_existing_id uuid;
  v_existing_code text;
  v_new_code text;
  v_new_id uuid;
begin
  if v_student is null then
    raise exception 'Not authenticated';
  end if;

  select status into v_status from enrollments
  where student_id = v_student and course_id = p_course_id;

  if v_status is distinct from 'completed' then
    raise exception 'Course is not marked completed for this student';
  end if;

  select id, certificates.certificate_code into v_existing_id, v_existing_code
  from certificates where student_id = v_student and course_id = p_course_id;

  if v_existing_id is not null then
    return query select v_existing_id, v_existing_code, true;
    return;
  end if;

  v_new_code := 'SPEA-' || extract(year from now())::text || '-' || lpad(nextval('certificate_seq')::text, 6, '0');

  insert into certificates (certificate_code, student_id, course_id)
  values (v_new_code, v_student, p_course_id)
  returning id into v_new_id;

  return query select v_new_id, v_new_code, false;
end;
$$;

grant execute on function issue_certificate_if_eligible(uuid) to authenticated;

-- Public verification lookup — deliberately returns only the handful of
-- fields a verifier needs (no student ID, no internal keys). Granted to
-- "anon" so the /verify/[code] page works for visitors who aren't logged in.
create or replace function verify_certificate(p_code text)
returns table(
  student_name text,
  course_title text,
  issued_at timestamptz,
  certificate_code text
)
language sql
security definer
set search_path = public
as $$
  select p.full_name, c.title, cert.issued_at, cert.certificate_code
  from certificates cert
  join profiles p on p.id = cert.student_id
  join courses c on c.id = cert.course_id
  where cert.certificate_code = p_code;
$$;

grant execute on function verify_certificate(text) to anon, authenticated;

-- ============================================================
-- PHASE 5 ADDITIONS: contact messages + profile avatars
-- (Run just this section if you've already run everything above.)
-- ============================================================

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

alter table contact_messages enable row level security;

-- Anyone (including logged-out visitors) can submit the contact form;
-- only admins can read submissions.
create policy "contact_messages_public_insert" on contact_messages
  for insert
  with check (true);

create policy "contact_messages_admin_read" on contact_messages
  for select
  using (is_admin());

create policy "contact_messages_admin_update" on contact_messages
  for update
  using (is_admin());

-- Public avatar images. Each student may only write inside a folder named
-- after their own auth.uid(); anyone can view (avatars are meant to be seen).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_upload_own_folder" on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_update_own_folder" on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_public_read" on storage.objects
  for select
  using (bucket_id = 'avatars');

-- ============================================================
-- PHASE 6 ADDITIONS: editable Academy Settings (contact + payment + social)
-- Run just this section if everything above already exists.
-- ============================================================
create table if not exists academy_settings (
  id int primary key default 1,
  contact_email text,
  whatsapp_number text,
  bank_account_title text,
  bank_name text,
  bank_account_number text,
  jazzcash_number text,
  easypaisa_number text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  updated_at timestamptz not null default now(),
  constraint academy_settings_singleton check (id = 1)
);

-- Exactly one row ever exists, so every part of the site reads the same settings.
insert into academy_settings (id) values (1) on conflict (id) do nothing;

alter table academy_settings enable row level security;

-- Public/anon can read (the Contact page needs this before login), only admin can edit.
create policy "academy_settings_public_read" on academy_settings
  for select
  using (true);

create policy "academy_settings_admin_write" on academy_settings
  for update
  using (is_admin());
