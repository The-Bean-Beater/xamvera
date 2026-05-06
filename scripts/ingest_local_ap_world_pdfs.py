import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "data/college-board/ap-world-history-local-sources.json"
DEFAULT_DOWNLOADS = Path.home() / "Downloads"
DEFAULT_OUTPUT = ROOT / "content-cache/college-board/ap-world-history-local"

QUESTION_START_RE = re.compile(r"^\s*(\d{1,3})[\.)]\s+(.+)")
CHOICE_RE = re.compile(r"^\s*\(?([A-E])\)?[\.)]?\s+(.+)")
FRQ_HINT_RE = re.compile(r"\b(SAQ|DBQ|LEQ|short-answer|document-based|long essay|free-response)\b", re.I)


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def load_manifest(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def source_pdf_path(source: dict, downloads_dir: Path) -> Path:
    return downloads_dir / source["local_filename"]


def write_page_assets(document: fitz.Document, source: dict, source_dir: Path, output_dir: Path, render_pages: bool) -> list[dict]:
    text_dir = source_dir / "text"
    image_dir = source_dir / "images"
    render_dir = source_dir / "page-renders"
    text_dir.mkdir(parents=True, exist_ok=True)
    image_dir.mkdir(parents=True, exist_ok=True)
    if render_pages:
        render_dir.mkdir(parents=True, exist_ok=True)

    pages = []
    for page_index, page in enumerate(document, start=1):
        text = page.get_text("text")
        text_path = text_dir / f"page-{page_index:03}.txt"
        text_path.write_text(text, encoding="utf-8")

        embedded_images = []
        for image_index, image_info in enumerate(page.get_images(full=True), start=1):
            xref = image_info[0]
            image = document.extract_image(xref)
            extension = image.get("ext", "png")
            image_path = image_dir / f"page-{page_index:03}-image-{image_index:02}.{extension}"
            image_path.write_bytes(image["image"])
            embedded_images.append(str(image_path.relative_to(output_dir)))

        page_render = None
        if render_pages:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            render_path = render_dir / f"page-{page_index:03}.png"
            pixmap.save(render_path)
            page_render = str(render_path.relative_to(output_dir))

        pages.append(
            {
                "page": page_index,
                "text": str(text_path.relative_to(output_dir)),
                "embedded_images": embedded_images,
                "page_render": page_render,
            }
        )

    return pages


def normalized_lines(text: str) -> list[str]:
    lines = []
    for raw_line in text.splitlines():
        line = re.sub(r"\s+", " ", raw_line).strip()
        if line:
            lines.append(line)
    return lines


def parse_choices(lines: list[str]) -> tuple[list[str], list[str]]:
    prompt_lines = []
    choices = []
    active_choice = None

    for line in lines:
        choice_match = CHOICE_RE.match(line)
        if choice_match:
            if active_choice:
                choices.append(active_choice.strip())
            active_choice = choice_match.group(2)
            continue

        if active_choice:
            active_choice += " " + line
        else:
            prompt_lines.append(line)

    if active_choice:
        choices.append(active_choice.strip())

    return prompt_lines, choices


def guess_question_type(block_text: str, choices: list[str]) -> str:
    if choices:
        return "multiple_choice"
    if FRQ_HINT_RE.search(block_text):
        return "free_response"
    return "question_candidate"


def candidate_fingerprint(candidate: dict) -> str:
    normalized = re.sub(r"\W+", " ", candidate["raw_text"].lower()).strip()
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def dedupe_candidates(candidates: list[dict]) -> tuple[list[dict], list[dict]]:
    unique = []
    seen = {}
    duplicates = []

    for candidate in candidates:
        fingerprint = candidate_fingerprint(candidate)
        candidate["fingerprint"] = fingerprint
        if fingerprint in seen:
            duplicates.append(
                {
                    "fingerprint": fingerprint,
                    "kept_candidate_id": seen[fingerprint],
                    "duplicate_candidate_id": candidate["candidate_id"],
                    "duplicate_source_id": candidate["source_id"],
                }
            )
            continue

        seen[fingerprint] = candidate["candidate_id"]
        unique.append(candidate)

    return unique, duplicates


def extract_question_candidates(source: dict, pages_text: list[tuple[int, str]]) -> list[dict]:
    candidates = []
    current = None

    for page_number, text in pages_text:
        for line in normalized_lines(text):
            start_match = QUESTION_START_RE.match(line)
            if start_match:
                if current:
                    candidates.append(current)

                current = {
                    "candidate_id": f"{source['id']}-q{int(start_match.group(1)):03}",
                    "source_id": source["id"],
                    "question_number": int(start_match.group(1)),
                    "pages": [page_number],
                    "raw_lines": [start_match.group(2)],
                }
                continue

            if current:
                if page_number not in current["pages"]:
                    current["pages"].append(page_number)
                current["raw_lines"].append(line)

    if current:
        candidates.append(current)

    cleaned = []
    for candidate in candidates:
        raw_text = " ".join(candidate["raw_lines"]).strip()
        prompt_lines, choices = parse_choices(candidate["raw_lines"])
        if len(raw_text) < 24:
            continue

        cleaned.append(
            {
                "candidate_id": candidate["candidate_id"],
                "source_id": candidate["source_id"],
                "question_number": candidate["question_number"],
                "pages": candidate["pages"],
                "question_type": guess_question_type(raw_text, choices),
                "prompt_candidate": " ".join(prompt_lines).strip(),
                "choices": choices,
                "raw_text": raw_text,
                "rights_status": "private_source_only_do_not_publish",
                "review_status": "needs_human_segmentation",
            }
        )

    return cleaned


def ingest_source(source: dict, downloads_dir: Path, output_dir: Path, render_pages: bool) -> dict:
    pdf_path = source_pdf_path(source, downloads_dir)
    if not pdf_path.exists():
        return {
            "source_id": source["id"],
            "title": source["title"],
            "missing": True,
            "expected_path": str(pdf_path),
        }

    source_dir = output_dir / source["id"]
    source_dir.mkdir(parents=True, exist_ok=True)
    copied_pdf_path = source_dir / "source.pdf"
    shutil.copyfile(pdf_path, copied_pdf_path)

    document = fitz.open(copied_pdf_path)
    pages = write_page_assets(document, source, source_dir, output_dir, render_pages)
    pages_text = [(page.number + 1, page.get_text("text")) for page in document]
    candidates = extract_question_candidates(source, pages_text)

    candidates_path = source_dir / "question-candidates.json"
    candidates_path.write_text(json.dumps(candidates, indent=2), encoding="utf-8")

    return {
        "source_id": source["id"],
        "title": source["title"],
        "year": source.get("year"),
        "type": source["type"],
        "local_filename": source["local_filename"],
        "pdf": str(copied_pdf_path.relative_to(output_dir)),
        "page_count": len(document),
        "embedded_image_count": sum(len(page["embedded_images"]) for page in pages),
        "question_candidate_count": len(candidates),
        "question_candidates": str(candidates_path.relative_to(output_dir)),
        "pages": pages,
    }


def ingest(args: argparse.Namespace) -> int:
    manifest = load_manifest(args.manifest)
    output_dir = args.output
    output_dir.mkdir(parents=True, exist_ok=True)

    sources = sorted(manifest["sources"], key=lambda source: source["priority"])
    if args.source_id:
        wanted = set(args.source_id)
        sources = [source for source in sources if source["id"] in wanted]

    extraction_manifest = {
        "course": manifest["course"],
        "rights_note": manifest["rights_note"],
        "generated_from": str(args.manifest),
        "output_policy": "private_local_cache_not_for_public_deploy",
        "sources": [],
    }

    all_candidates = []
    for source in sources:
        print(f"Ingesting {source['id']}...")
        source_result = ingest_source(source, args.downloads_dir, output_dir, args.render_pages)
        extraction_manifest["sources"].append(source_result)

        candidates_path = output_dir / source_result.get("question_candidates", "")
        if candidates_path.exists():
            all_candidates.extend(json.loads(candidates_path.read_text(encoding="utf-8")))

    manifest_path = output_dir / "extraction-manifest.json"
    manifest_path.write_text(json.dumps(extraction_manifest, indent=2), encoding="utf-8")

    all_candidates_path = output_dir / "all-question-candidates.json"
    all_candidates_path.write_text(json.dumps(all_candidates, indent=2), encoding="utf-8")

    deduped_candidates, duplicate_groups = dedupe_candidates(all_candidates)
    deduped_path = output_dir / "deduped-question-candidates.json"
    duplicate_path = output_dir / "duplicate-question-candidates.json"
    deduped_path.write_text(json.dumps(deduped_candidates, indent=2), encoding="utf-8")
    duplicate_path.write_text(json.dumps(duplicate_groups, indent=2), encoding="utf-8")

    print(f"Wrote {manifest_path}")
    print(f"Wrote {all_candidates_path}")
    print(f"Wrote {deduped_path}")
    print(f"Wrote {duplicate_path}")
    print(f"Question candidates: {len(all_candidates)}")
    print(f"Unique question candidates: {len(deduped_candidates)}")
    print(f"Duplicate candidates: {len(duplicate_groups)}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a private AP World History source bank from local PDFs.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--downloads-dir", type=Path, default=DEFAULT_DOWNLOADS)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--source-id", action="append", help="Limit to one or more source ids.")
    parser.add_argument("--render-pages", action="store_true", help="Render every PDF page as a PNG for image/stimulus review.")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(ingest(parse_args()))
