# AP World Private Source Bank

This project now has a private local AP World History source-bank workflow for user-provided College Board practice PDFs.

## Why This Is Private

The PDFs contain College Board copyrighted material. Extracted copied questions, answer choices, images, and page renders should stay in `content-cache/`, which is ignored by Git and does not deploy to Netlify.

Use this bank for:

- private source review
- question pattern analysis
- human-guided remixing
- future draft generation

Do not use it for:

- publishing copied questions directly to the public website
- committing extracted questions to GitHub
- deploying College Board source pages/images to Netlify

## Local Dataset Paths

The ingestion output lives here:

```text
content-cache/college-board/ap-world-history-local/
```

Key files:

```text
content-cache/college-board/ap-world-history-local/extraction-manifest.json
content-cache/college-board/ap-world-history-local/all-question-candidates.json
content-cache/college-board/ap-world-history-local/deduped-question-candidates.json
content-cache/college-board/ap-world-history-local/duplicate-question-candidates.json
```

Each source PDF also has its own folder with:

- `source.pdf`
- `text/page-###.txt`
- `images/`
- `page-renders/page-###.png`
- `question-candidates.json`

## Current Batch Summary

The May 6, 2026 local ingest included seven AP World PDFs from the user&apos;s Downloads folder.

Result:

- 342 PDF pages extracted
- 66 embedded images extracted
- 455 raw question candidates detected
- 363 unique question candidates after dedupe
- 92 duplicate candidates detected

## Re-run The Ingest

From the project folder:

```bash
python3 scripts/ingest_local_ap_world_pdfs.py --render-pages
```

The script reads this manifest:

```text
data/college-board/ap-world-history-local-sources.json
```

If more PDFs are added later, add their filenames to that manifest first.
