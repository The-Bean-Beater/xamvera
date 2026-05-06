# Xamvera AI Next Steps

## Current Phase

We have a hosted static shell. The next goal is to turn the shell into a real product plan and then rebuild it as a proper web app.

## Build Order

### 1. Define The First Version

Decide what the first usable version does.

Recommended MVP:

- Student can choose an AP course
- Student can answer practice questions
- Student can see if an answer is correct
- Student can read an explanation
- Student can see basic progress
- Admin can add or review questions manually

Do not start with AI generation. Start with trusted human-entered questions and review workflows.

### 2. Design The Core Screens

Create clear versions of these screens:

- Landing page
- Student dashboard
- Course page
- Practice question page
- Results/progress page
- Admin question review page
- Login/signup page
- Pricing page

### 3. Convert To A Real Web App

Move from plain HTML/CSS/JS to:

- Next.js
- TypeScript
- Component-based UI
- Real routes for each page

This is the point where the project becomes a real app instead of a static shell.

### 4. Add Accounts And Database

Recommended backend:

- Supabase Auth for accounts
- Postgres database for courses, questions, attempts, progress, and review status

Core database tables:

- users
- courses
- units
- questions
- answer_choices
- attempts
- explanations
- review_items

### 5. Add Human Review System

Before AI generation, build the approval system.

Every question should have:

- source notes
- skill tags
- difficulty
- answer key
- explanation
- review status
- reviewer notes

### 6. Add Payments

Use Stripe for the website subscription flow.

Start simple:

- free preview tier
- paid student subscription
- later, school/team accounts

### 7. Add AI Carefully

AI should help draft or classify content, but not publish directly.

AI-assisted items should always go through human review before students see them.

## What We Should Do Next

Next, build the real landing page and student dashboard design for Xamvera AI.

After that, convert the project to Next.js so it can support real app features.
