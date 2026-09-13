-- ============================================================
-- Phase 3 update: run this ONLY if you already ran the original
-- supabase/schema.sql in an earlier phase. If you're setting up a brand
-- new Supabase project, skip this file — it's already included in
-- schema.sql.
--
-- What this does: locks down quiz_questions (which stores the correct
-- answer) so students can no longer read it directly, adds a safe view
-- for the quiz-taking screen, and adds a database function that grades
-- quiz attempts entirely on the server.
-- ============================================================

drop policy if exists "quiz_questions_read" on quiz_questions;
drop policy if exists "quiz_questions_admin_write" on quiz_questions;
drop policy if exists "quiz_questions_admin_read" on quiz_questions;
drop policy if exists "quiz_questions_admin_update" on quiz_questions;
drop policy if exists "quiz_questions_admin_delete" on quiz_questions;

create policy "quiz_questions_admin_read" on quiz_questions for select using (is_admin());
create policy "quiz_questions_admin_write" on quiz_questions for insert with check (is_admin());
create policy "quiz_questions_admin_update" on quiz_questions for update using (is_admin());
create policy "quiz_questions_admin_delete" on quiz_questions for delete using (is_admin());

create or replace view quiz_questions_public as
  select id, quiz_id, question_type, question_text, options, position
  from quiz_questions;

grant select on quiz_questions_public to authenticated;

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
