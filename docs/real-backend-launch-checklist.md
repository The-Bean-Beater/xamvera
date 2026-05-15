# XamVera Real Backend Launch Checklist

This is the path for making Google login, account creation, saved progress, and personalized practice real.

## 1. Supabase

Create a Supabase project and run these files in order from the SQL editor:

```text
supabase/schema.sql
supabase/seed.sql
```

Then enable Auth providers:

- Email
- Google

In Supabase Auth URL settings, add:

```text
http://localhost:3000/auth/callback
https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
https://YOUR-CUSTOM-DOMAIN.com/auth/callback
```

For Google OAuth, Google Cloud should use Supabase's callback URL:

```text
https://YOUR-SUPABASE-PROJECT-REF.supabase.co/auth/v1/callback
```

## 2. Environment Variables

Add these locally in `.env.local` and in the deployment platform:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-SUPABASE-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-SUPABASE-PUBLISHABLE-OR-ANON-KEY
```

Never commit `.env.local`.

## 3. Deploy

Recommended production host:

```text
Vercel
```

Why:

- This repo already has a Next.js App Router app.
- Vercel supports middleware and route handlers.
- Supabase auth callbacks can run server-side.

## 4. Demo Validation

Before pitching the real backend version, test this flow:

1. Open the Vercel URL.
2. Click Practice while signed out.
3. Confirm it redirects to Login.
4. Sign in with Google.
5. Confirm it returns to Dashboard.
6. Answer practice questions.
7. Confirm the feedback says progress was saved.
8. Open Dashboard.
9. Confirm weak units, recent accuracy, XP, streak, and recommended focus update.

## 5. Current Backend Behavior

The Next app already does the core product loop:

- Google/email login through Supabase Auth.
- Protected `/dashboard`, `/practice`, and `/settings`.
- Attempts are written to `public.attempts`.
- Concept mastery is written to `public.mastery`.
- Dashboard recommendations come from saved attempts and low mastery scores.
- Row-level security keeps each student's attempts/mastery private.

