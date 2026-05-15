# GitHub Pages + Supabase Auth

GitHub Pages can run real Supabase Auth because the browser talks directly to Supabase with the public anon/publishable key.

## What Works

- Google sign in
- Email account creation
- Saved practice attempts
- Concept mastery updates
- Dashboard personalization

## What Still Does Not Belong In GitHub Pages

- Secret service-role keys
- OpenAI API keys
- Stripe webhook secrets
- Private admin-only backend logic

Those need a server runtime such as Vercel or Netlify.

## Static Site Setup

Edit `supabase-config.js`:

```js
window.XAMVERA_SUPABASE = {
  url: "https://YOUR-PROJECT-REF.supabase.co",
  anonKey: "YOUR-SUPABASE-ANON-OR-PUBLISHABLE-KEY"
};
```

The anon/publishable key is safe to expose. Supabase row-level security is what protects user data.

## Supabase Setup

Run these files in Supabase SQL editor:

```text
supabase/schema.sql
supabase/seed.sql
```

In Supabase Authentication settings:

- Enable Email
- Enable Google
- Set Site URL to `https://the-bean-beater.github.io/xamvera/`
- Add redirect URL `https://the-bean-beater.github.io/xamvera/`

In Google Cloud OAuth settings, the Authorized redirect URI should be:

```text
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
```

Also add this Authorized JavaScript origin:

```text
https://the-bean-beater.github.io
```

