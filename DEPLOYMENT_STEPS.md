# Exact Website Hosting Steps

## Best Free First Launch

Use Netlify first because this project is currently plain HTML, CSS, and JavaScript.

You will get a free placeholder URL like:

```text
https://your-site-name.netlify.app
```

That is enough for testing, sharing, and showing people the idea. Later, you can buy a real domain and connect it.

## What You Need

- A GitHub account
- A Netlify account
- This project folder
- A placeholder site name

## Step 1: Make A GitHub Account

1. Go to `https://github.com`.
2. Create an account.
3. Verify your email.

GitHub is where the code will live.

## Step 2: Make A Netlify Account

1. Go to `https://netlify.com`.
2. Sign up with your GitHub account.

Netlify is where the website will be hosted.

## Step 3: Put The Code On GitHub

Create a new GitHub repository.

Good temporary repository name:

```text
study-platform-starter
```

Then upload these files:

- `index.html`
- `styles.css`
- `script.js`
- `PROJECT_PLAN.md`
- `DEPLOYMENT_STEPS.md`

## Step 4: Deploy On Netlify

1. Open Netlify.
2. Click `Add new site`.
3. Choose `Import an existing project`.
4. Connect GitHub.
5. Choose the repository.
6. For build command, leave it blank.
7. For publish directory, use:

```text
.
```

8. Click deploy.

Netlify will give you a live website URL.

## Step 5: Rename The Free Website URL

1. In Netlify, open the site.
2. Go to site settings.
3. Find the site name.
4. Change it to a clean placeholder name.

Example:

```text
ap-study-lab.netlify.app
```

The exact name must be available.

## Step 6: Later, Buy A Real Domain

Do this later, after the name is final.

Examples:

- `yourbrand.com`
- `yourbrand.io`
- `yourbrand.app`

Then connect the domain to Netlify or Vercel.

## The Better Future Setup

Once we need accounts, saved progress, payments, and a database, we should rebuild this starter as a Next.js app and host it on Vercel.

The future production stack:

- Next.js
- TypeScript
- Supabase or Postgres
- Stripe
- Vercel

## What To Do Right Now

1. Pick a temporary working name.
2. Make GitHub and Netlify accounts.
3. Put this starter on GitHub.
4. Deploy it to Netlify.
5. Share the free Netlify URL.
6. Then we start rebuilding the real app screen by screen.
