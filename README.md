# Saima Perveen English Academy — LMS

Phase 1 (public site, database, auth, student dashboard) and Phase 2
(the Admin/Teacher dashboard) are both built.

## What's built — Phase 1

- Full database schema with Row Level Security (`supabase/schema.sql`) covering
  courses, modules, lessons, quizzes, assignments, enrollments, progress,
  certificates, live classes, and notifications
- Home, Courses, Course Detail pages (pulling real data from Supabase)
- Register, Login, Forgot Password (Supabase Auth)
- Enrollment flow: instant for free courses, payment-reference submission
  for paid courses (manual approval — no fake payment gateway)
- Student Dashboard: welcome message, per-course progress bars, upcoming
  live classes, most recent quiz score, certificate count
- Middleware that blocks logged-out visitors from `/dashboard` and `/learn`,
  and blocks students from ever reaching `/admin`

## What's built — Phase 2 (Admin/Teacher dashboard, at `/admin`)

- **Overview** — total students, active students, total courses, completed
  courses, quiz attempts, certificates issued, plus an "needs your attention"
  panel that surfaces pending payment approvals and ungraded submissions
- **Courses** — list all courses, create a new course (title, slug,
  description, image, price/free toggle, level, duration), open a course to
  manage its modules and lessons
- **Course builder** (`/admin/courses/[id]`) — add/reorder modules (weeks),
  add lessons under each module
- **Lesson editor** (`/admin/courses/[id]/lessons/[lessonId]`) — set video
  URL, PDF/worksheet URL, and lesson notes; build a quiz for that lesson
  (passing %, allow-retake toggle, add multiple-choice or true/false
  questions, mark the correct answer, delete questions)
- **Enrollments** — see pending payment-reference submissions with the
  student's reference note, approve or reject each one
- **Assignments** — see submitted assignments awaiting grading, open a
  submission, enter a grade and feedback
- **Students** — full student list with enrollment counts
- **Live Classes** — schedule a class (title, course, date, time, meeting
  link, instructions); students only see the link once enrolled
- Every admin Server Action re-checks `role = admin` server-side
  (`lib/requireAdmin.ts`) — middleware blocking the page isn't the only
  guard, since actions can in principle be called directly

## What's built — Phase 3 (student lesson, quiz-taking, and assignments)

- **Lesson page** (`/learn/[courseId]/lessons/[lessonId]`) — embeds the
  lesson video (YouTube/Vimeo links are auto-converted to embed URLs),
  shows notes and a worksheet/PDF download link, and a "Mark lesson as
  complete" toggle. Completing every lesson in a course automatically
  flips the enrollment to `completed` so it's reflected on both the
  student dashboard and the admin overview stats.
- **Quiz-taking flow** — students answer one question per card and submit;
  grading happens **entirely inside Postgres** via the `submit_quiz_attempt`
  database function, so the correct answers never travel to the browser at
  any point, before or after submission. A results page shows the score,
  pass/fail, and a correct/incorrect mark per question (never the answer
  itself, so a failed attempt can be retaken fairly when retakes are on).
- **Assignment submission** — students upload a file (PDF, Word, image,
  zip, audio/video — 20MB limit) which goes to a **private** Supabase
  Storage bucket scoped to their own folder; a long-lived signed link is
  what gets saved to `assignment_submissions.file_url`, so the admin
  grading page (built in Phase 2) can open it directly. Re-submitting
  replaces the file and re-queues it for grading.
- New SQL in `supabase/schema.sql` (bottom section, clearly marked "PHASE
  3 ADDITIONS"): a `get_quiz_attempt_review()` function, the
  `assignment-submissions` Storage bucket, and its access policies. If
  you already ran the schema in Phase 1/2, you only need to run that one
  new section — everything above it already exists in your database.

## What's built — Phase 4 (certificates)

- **Automatic issuance** — the moment a student finishes every lesson in a
  course, a certificate is issued automatically (via the same DB function
  that flips the enrollment to `completed`), with a code in the format
  `SPEA-2026-000123`. It's idempotent, so it never double-issues.
- **`/dashboard/certificates`** — lists every certificate a student has
  earned, with a "Download PDF" button and a link to its public
  verification page.
- **PDF generation** (`/api/certificates/[id]`) — a real, generated PDF
  (not a template image) built with `pdf-lib` at request time: academy
  name, "Certificate of Completion," the student's name, course title,
  issue date, your name and title as signatory, the certificate ID, and a
  link to verify it — styled in the same navy/gold/serif palette as the
  rest of the site. Access is gated by the same RLS as the certificates
  table, so a student can only ever download their own.
- **`/verify/[code]`** — a public page (no login needed) anyone can open
  to confirm a certificate is genuine — shows the student's name, course,
  and issue date via a database function that deliberately exposes nothing
  else (no student ID, no internal keys).
- New SQL in `supabase/schema.sql` (bottom section, marked "PHASE 4
  ADDITIONS"): the certificate-numbering sequence, `issue_certificate_if_eligible()`,
  and `verify_certificate()`. Same as before — if you've already run the
  file, you only need to run this new section.
- New dependency: `pdf-lib` (added to `package.json` — run `npm install`
  again after pulling this phase).

## Not yet built (next phase)

- My Courses / Profile Settings / Contact / FAQ / Privacy / Terms pages
  (My Courses already exists — the rest are straightforward static or
  simple-list pages)

Say the word and I'll build those next.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

## 2. Create your Supabase project

1. Go to https://supabase.com → New project (free tier is enough to start)
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — never
     put it in a file the browser can see; it's only for future admin-only
     server actions)
3. Paste these into `.env.local`
4. Open **SQL Editor → New query**, paste the entire contents of
   `supabase/schema.sql`, and run it. This creates every table, security
   policy, and the trigger that auto-creates a profile on sign-up.

## 3. Make yourself the admin

After you register your own account through `/register`, go to the Supabase
**Table Editor → profiles**, find your row, and change `role` from `student`
to `admin`. (The Admin Dashboard UI for managing this comes in the next
phase — for now this one manual step unlocks it.)

## 4. Run it locally

```bash
npm run dev
```

Visit http://localhost:3000

## 5. Add your first course

Now that the Admin dashboard is built, do this in the app instead of the
Supabase Table Editor:

1. Log in, go to `/admin/courses` → **New course** → fill in title,
   description, price (or mark it free), level, and duration
2. Open the course → add a module for each week
3. Open a module → add lessons; open a lesson to set its video URL, PDF
   link, notes, and (optionally) build its quiz
4. Set the course to published from the course page so it appears on the
   public site

## 6. Certificates — how issuing works

Nothing to do manually here: as soon as a student marks every lesson in a
course complete, the enrollment flips to `completed` and a certificate is
issued automatically. If you ever need to check on one, `certificates` in
the Supabase Table Editor shows every certificate issued, and
`/dashboard/certificates` (as that student) or `/verify/[code]` (public)
will show it.

## 7. Deploy

1. Push this project to a GitHub repository
2. Go to https://vercel.com → New Project → import the repo
3. Add the same three environment variables from `.env.local` in Vercel's
   Environment Variables settings
4. Deploy — Vercel gives you a free `.vercel.app` URL, and you can attach
   a custom domain later

## Environment variables required

| Variable | Where to get it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Yes (safe — protected by Row Level Security) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | No — server-only, used in later admin phases |

No payment gateway keys are needed yet — the manual-approval enrollment flow
needs none, and the schema is already shaped so Stripe (or a Pakistani
gateway) can be dropped in later without restructuring the database.
