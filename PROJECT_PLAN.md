# Veritas AP Plan

## Recommended Direction

Build the web product first as a professional hosted web app, then package mobile apps from the same core product once the platform has real users, accounts, billing, and study data.

The best first production stack is:

- Next.js for the website/app interface
- TypeScript for safer code
- Supabase or another Postgres backend for auth, database, and permissions
- Stripe for web subscriptions and school billing
- Vercel for hosting, preview links, custom domains, and deployments
- Capacitor later if we want iOS and Android apps from the web codebase

## Why Web First

The core product is studying: dashboards, question banks, progress tracking, explanations, review tools, admin tools, and payments. Those are web-app problems first.

A web-first build lets us:

- Launch faster
- Share one URL with students and teachers
- Update instantly without app store review
- Test pricing, course coverage, and question quality quickly
- Keep one codebase that can later become a PWA or native app wrapper

Mobile apps should come after the web app has enough value to justify App Store and Play Store review.

## Important App Store Reality

An iOS app does need an Apple build pipeline, usually through Xcode or a tool that generates an Xcode project. But that does not mean the entire product has to be hand-written in Swift from day one.

For this product, there are three realistic paths:

1. Web app only at first
   - Best for the MVP.
   - Host on a real domain.
   - Make it responsive and installable as a PWA.

2. Web app plus Capacitor
   - Best likely long-term path.
   - Build the product in Next.js.
   - Use Capacitor to package it for iOS and Android.
   - Open the iOS project in Xcode for signing, testing, and App Store upload.

3. Separate native apps with React Native or Swift/Kotlin
   - Best only if the app needs deep native features.
   - More expensive and slower.
   - More code to maintain.

## Suggested Folder Structure Later

When we move beyond this static prototype:

```text
apps/
  web/              Next.js hosted web app
  mobile/           Capacitor or Expo mobile shell
packages/
  ui/               Shared components and design system
  core/             Study logic, scoring, question types
  db/               Database schema and typed queries
  ai-review/        Drafting, validation, review workflows
docs/
  product.md
  architecture.md
  legal-and-content.md
```

## Hosting Basics

The files in this folder are local right now because this is only the first prototype. A professional website needs:

1. A code repository, usually GitHub
2. A hosting provider, such as Vercel
3. A custom domain, such as `yourname.com`
4. DNS settings that point the domain to the hosting provider
5. Production environment variables for secrets like Stripe and database keys

Google is not usually where the website is hosted. Google Search finds websites. Hosting is handled by platforms like Vercel, Netlify, AWS, Render, or similar.

## Product Build Order

1. Rename and brand the product.
2. Convert this static prototype into a Next.js app.
3. Add real routing: dashboard, courses, practice, question lab, admin review, billing.
4. Add auth and database.
5. Build the question database model.
6. Build human review workflows before AI generation.
7. Add Stripe for web billing.
8. Launch a private beta on a hosted domain.
9. Add PWA features: installable app icon, offline shell, push notifications later.
10. Package app store builds only when the web product is stable.

## Question Quality Rules

The product should never treat AI output as automatically correct.

Every AI-generated or AI-assisted question should have:

- Source references
- Skill tags
- Difficulty tags
- Answer-key validation
- Explanation validation
- Human approval before appearing in student practice
- Version history
- A way to retire bad questions

## Business Risks To Handle Early

- College Board content rights and trademarks
- Privacy rules for student data
- Payment rules on web versus iOS apps
- App Store review rules
- Accessibility
- Question accuracy and trust
- Clear separation between official source material and original generated content
