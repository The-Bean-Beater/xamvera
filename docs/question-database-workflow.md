# XamVera Question Database Workflow

## Goal

Keep the public website student-facing, while question review and generation happen in a private admin/backend workflow.

## Current Temporary Admin Access

The public sidebar no longer shows the review page.

During the static-site prototype, the hidden review workspace is still available by opening:

```text
https://your-netlify-site/#admin-review
```

This is not real security. It is just hidden from normal visitors until we add accounts and a backend.

## Future Real Admin Setup

When we convert to Next.js and Supabase, the admin workflow should move to:

```text
/admin/review
```

That route should require login and an `admin` role.

## Three Database Model

### 1. Source Question Database

Purpose: store extracted source material for internal research only.

Contents:

- College Board source documents
- High School Test Prep scraped pages
- source URLs
- page numbers
- extracted images/page renders
- raw text
- source ownership and rights notes

Status: private/internal only.

Suggested table names:

- `source_documents`
- `source_pages`
- `source_items`
- `source_assets`

### 2. Draft/Remixed Question Database

Purpose: store new generated or remixed questions that need review.

Contents:

- original Xanvera questions
- AI-generated drafts
- source-inspired drafts
- linked stimulus-set drafts with shared `set_id`
- image/document asset metadata that requires verification before approval
- revision attempts
- reviewer feedback
- similarity/copyright risk

Statuses:

- `draft`
- `needs_review`
- `needs_revision`
- `revised`

Suggested table names:

- `draft_questions`
- `draft_question_choices`
- `draft_question_versions`
- `revision_feedback`

### 3. Decision/Approved Question Database

Purpose: store final decisions and approved public questions.

Contents:

- approved questions
- rejected questions
- revision history
- final answer keys
- final explanations
- review gates
- approval timestamps

Statuses:

- `approved`
- `rejected`
- `needs_revision`

Suggested table names:

- `approved_questions`
- `approved_question_choices`
- `review_decisions`
- `published_question_sets`

## Revision Loop

1. Source material is imported into database 1.
2. AI or a writer creates a new draft in database 2.
3. Admin reviews the draft. For linked stimulus sets, each question is reviewed individually while preserving the shared set metadata.
4. If approved, it moves into database 3.
5. If rejected, the decision is stored in database 3.
6. If revision is needed, feedback is stored and the draft returns to database 2.
7. AI remakes the question using the feedback.
8. The revised question returns to admin review.

## Next Build Step

Convert this static site to a real app stack:

- Next.js
- Supabase Auth
- Supabase/Postgres
- protected admin routes

Until then, the review page uses browser local storage and is not a real shared database.
