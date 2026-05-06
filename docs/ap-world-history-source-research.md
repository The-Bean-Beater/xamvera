# AP World History Source Research

## Bottom Line

The reliable official source is College Board AP Central. For AP World History: Modern, AP Central publicly provides recent free-response question PDFs, scoring guidelines, sample responses, scoring statistics, and score distributions.

It does not publicly provide every complete past exam with all multiple-choice questions. College Board states that AP Central provides the three most recent years of released exam materials, while older comprehensive and secure practice questions are available through AP Classroom for authorized educators.

For XamVera, the safe first database should use official AP Central links and store source metadata. We should not build production ingestion from Course Hero, Studocu, Scribd, or random reposts.

## Priority Sources

### 2017 Course and Exam Description Practice Exam

- Official College Board URL found in public references: `https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap-world-history-ced-practice-exam.pdf`
- Local file supplied for development: `ap-world-history-ced-practice-exam.pdf`
- This is a 47-page College Board practice exam from the Course and Exam Description. It includes multiple-choice content, which makes it useful for early ingestion tests.
- Because it is still copyrighted, extracted content should stay in the ignored `content-cache/` folder until we decide the publishing model.

### 2024

- Free-response questions, Set 1: `https://apcentral.collegeboard.org/media/pdf/ap24-frq-world-history-set-1.pdf`
- Free-response questions, Set 2: `https://apcentral.collegeboard.org/media/pdf/ap24-frq-world-history-set-2.pdf`
- Scoring guidelines, Set 1: `https://apcentral.collegeboard.org/media/pdf/ap24-sg-world-history-modern-set-1.pdf`
- Scoring guidelines, Set 2: `https://apcentral.collegeboard.org/media/pdf/ap24-sg-world-history-modern-set-2.pdf`

### 2023

- Free-response questions, Set 1: `https://apcentral.collegeboard.org/media/pdf/ap23-frq-world-history-modern-set-1.pdf`
- Free-response questions, Set 2: `https://apcentral.collegeboard.org/media/pdf/ap23-frq-world-history-modern-set-2.pdf`
- Scoring guidelines, Set 1: `https://apcentral.collegeboard.org/media/pdf/ap23-sg-world-history-modern-set-1.pdf`
- Scoring guidelines, Set 2: `https://apcentral.collegeboard.org/media/pdf/ap23-sg-world-history-modern-set-2.pdf`

### 2022

- Free-response questions: `https://apcentral.collegeboard.org/media/pdf/ap22-frq-world-history-modern.pdf`
- Scoring guidelines: `https://apcentral.collegeboard.org/media/pdf/ap22-sg-world-history-modern.pdf`

### 2021

- Official public AP Central source confirmed: DBQ sample responses/scoring commentary: `https://apcentral.collegeboard.org/media/pdf/ap21-apc-world-history-dbq.pdf`
- I found third-party reposts of 2021 FRQ packets, but no official public AP Central FRQ URL was confirmed during this search.

### 2020

- I did not confirm an official public AP Central released test packet for 2020 AP World History: Modern.
- Third-party sites appear to repost practice-exam material, including multiple-choice content. We should not ingest those into XamVera without a rights review.

## Legal/Product Rule

College Board materials are copyrighted. Public PDFs can be useful for internal indexing, source links, and student practice only after we decide the usage model. The safer public product path is:

1. Store official source metadata.
2. Extract text/images into a private local cache for development.
3. Build reviewer tools that preserve source attribution.
4. Publish only content we have permission to use or original questions reviewed against the official style.

## Technical Plan

The first ingestion script should:

- Read `data/college-board/ap-world-history-modern-sources.json`
- Download only official public PDFs with URLs
- Save PDFs to `content-cache/`, which is ignored by Git
- Extract page text
- Render page PNGs for documents/maps/images that do not extract cleanly
- Extract embedded images where available
- Write a local manifest for each source

Later, after Next.js/Supabase exists, we can turn extracted records into database rows:

- source_documents
- source_pages
- question_groups
- questions
- stimuli
- rubrics
- answer_guidelines
- review_status

## Third-Party Practice Sites

High School Test Prep has AP World practice pages at `https://highschooltestprep.com/ap/world-history/`. The site says College Board is not affiliated with or endorsing it.

I added a separate third-party manifest and scraper for local review only:

- `data/third-party/highschooltestprep-ap-world-history.json`
- `scripts/scrape_highschooltestprep.py`

Do not publish copied third-party questions/images without permission or a rights review.

Initial local scrape test:

- `hstp-apwh-unit-1`
- 29 raw question blocks detected
- 16 image references detected
- Output path: `content-cache/third-party/highschooltestprep-ap-world-history/`

The scraper may need `--allow-insecure-ssl` on this machine because the local Python certificate store rejected the site's certificate chain.

## Machine Learning Later

Do not train on or generate from copyrighted material casually. The safer path is to use official materials to build metadata and reviewer rubrics, then generate original questions from our own course framework and public-domain/open-licensed sources. Human review should remain mandatory.
