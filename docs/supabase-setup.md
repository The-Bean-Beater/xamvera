# XamVera Supabase Setup

## Install

```bash
npm install
```

The app uses Next.js App Router, React, TypeScript, TailwindCSS, `@supabase/supabase-js`, and `@supabase/ssr`.

## Environment

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

In Supabase Auth, enable Email and Google providers. Add these redirect URLs:

```text
http://localhost:3000/auth/callback
https://your-production-domain.com/auth/callback
```

## Database

Run `supabase/schema.sql` in the Supabase SQL editor first, then run `supabase/seed.sql`.

Relationship model:

- `profiles.id` maps one-to-one to `auth.users.id`.
- `courses` contain AP course shells.
- `units` belong to courses.
- `concepts` belong to units and carry difficulty, exam frequency, and importance weight.
- `questions` belong to concepts and store approved prompt data.
- `attempts` are user-owned answer events.
- `mastery` is one row per user and concept.

RLS keeps user-owned rows private:

- Students can read and update only their own `profiles`.
- Students can insert/read only their own `attempts`.
- Students can insert/read/update only their own `mastery`.
- Authenticated users can read course, unit, concept, and approved question rows.
- Content mutation should happen later through an admin/service-role review pipeline, not directly from student clients.

## Runtime Notes

Cookie auth is handled by `middleware.ts` and the Supabase server client in `lib/supabase/server.ts`.

Protected routes:

- `/dashboard`
- `/practice`
- `/settings`

GitHub Pages cannot run this SSR auth layer. Deploy the Next app to a runtime that supports middleware and route handlers, such as Vercel or Netlify with the Next adapter.

## Implementation Map

```text
app/
  layout.tsx
  globals.css
  (platform)/
    layout.tsx
    page.tsx
    dashboard/page.tsx
    courses/page.tsx
    courses/CoursesClient.tsx
    practice/page.tsx
    settings/page.tsx
  login/page.tsx
  login/LoginForm.tsx
  auth/callback/route.ts
  auth/signout/route.ts
components/
  Shell.tsx
  ThemeControls.tsx
  dashboard/DashboardPanels.tsx
  practice/PracticeClient.tsx
lib/
  actions/auth.ts
  actions/practice.ts
  data/courses.ts
  data/dashboard.ts
  data/practice.ts
  data/practice-loader.ts
  data/profile.ts
  mastery.ts
  supabase/client.ts
  supabase/server.ts
  supabase/middleware.ts
  supabase/env.ts
middleware.ts
supabase/schema.sql
supabase/seed.sql
types/database.ts
```
