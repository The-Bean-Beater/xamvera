# AP World Question Maker

XamVera now has a first-pass AP World draft question generator.

## What It Does

The generator reads the private College Board source-bank profile from:

```text
content-cache/college-board/ap-world-history-local/deduped-question-candidates.json
```

It uses that private bank for structural signals only:

- question type distribution
- answer choice count
- general prompt/stimulus length patterns

It does not copy College Board prompts, choices, explanations, images, or source text into generated questions.

## Output

Generated drafts are written to:

```text
data/admin/generated-ap-world-drafts.json
```

The script can also merge drafts into:

```text
data/admin/question-review-queue.json
```

Those drafts show up in the hidden admin review page:

```text
https://the-bean-beater.github.io/xamvera/#admin-review
```

## Run It

From the project folder:

```bash
python3 scripts/generate_ap_world_drafts.py --count 12 --update-review-queue
```

## Review Rules

Every generated question starts as `needs_review`.

Before approving:

- verify the answer is correct
- verify the explanation is accurate
- confirm the question is original enough to publish
- revise anything that feels too generic, too vague, or too close to source material

The current static-site review page stores your review decisions in browser local storage. The app now merges local review decisions with newly deployed review-queue items, so new generated drafts should appear even if you reviewed earlier drafts in the same browser.
