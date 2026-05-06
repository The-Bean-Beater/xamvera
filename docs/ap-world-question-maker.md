# AP World Question Maker

XamVera now has an AP World draft question generator pipeline.

## What It Does

The generator reads the private College Board source-bank profile from:

```text
content-cache/college-board/ap-world-history-local/deduped-question-candidates.json
```

It uses that private bank for structural signals only:

- question type distribution
- answer choice count
- general prompt/stimulus length patterns

It does not copy College Board prompts, choices, explanations, images, document excerpts, or source text into generated questions.

## Current Pipeline

The script now creates three review-first AP World draft types:

- `image_set`: image-stimulus sets with 3 linked questions sharing a `set_id`
- `document_set`: long historical document stimulus sets with 3 linked questions sharing a `set_id`
- `short_scenario`: short stimulus/scenario questions

Each linked-set question is still stored as an individual review item so the current static admin page can approve, reject, or request revision one question at a time. Set metadata (`set_id`, `set_title`, `set_question_number`, `linked_question_ids`) keeps the three questions connected.

The no-stimulus and data/map/chart branches are intentionally marked as planned in the generated style profile until the review UI and source registry can handle them cleanly.

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

Generate only one branch:

```bash
python3 scripts/generate_ap_world_drafts.py --kinds image_set --count 6 --update-review-queue
```

## Review Rules

Every generated question starts as `needs_review`.

Before approving:

- verify the answer is correct
- verify the explanation is accurate
- confirm the question is original enough to publish
- for image sets, verify the image file, alt text, and asset rights before approval
- for document sets, verify the identified source and confirm the stimulus paraphrase is accurate and publishable
- revise anything that feels too generic, too vague, or too close to source material

The current static-site review page stores your review decisions in browser local storage. The app now merges local review decisions with newly deployed review-queue items, so new generated drafts should appear even if you reviewed earlier drafts in the same browser.
