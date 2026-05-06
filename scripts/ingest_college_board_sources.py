import argparse
import json
import shutil
import sys
import urllib.request
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "data/college-board/ap-world-history-modern-sources.json"
DEFAULT_OUTPUT = ROOT / "content-cache/college-board/ap-world-history-modern"


def load_manifest(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def official_downloadable_sources(manifest: dict) -> list[dict]:
    sources = []
    for source in manifest["sources"]:
        if source.get("url") and source.get("public_status", "").startswith("official_public"):
            sources.append(source)
    return sorted(sources, key=lambda item: item["priority"])


def parse_local_pdfs(values: list[str] | None) -> dict[str, Path]:
    local_pdfs = {}
    for value in values or []:
      if "=" not in value:
          raise ValueError("--local-pdf must use SOURCE_ID=/path/to/file.pdf")
      source_id, pdf_path = value.split("=", 1)
      local_pdfs[source_id] = Path(pdf_path).expanduser()
    return local_pdfs


def download_pdf(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": "XamVera source indexer"})
    with urllib.request.urlopen(request, timeout=30) as response:
        destination.write_bytes(response.read())


def extract_pdf(source: dict, pdf_path: Path, output_dir: Path, render_pages: bool) -> dict:
    source_dir = output_dir / source["id"]
    text_dir = source_dir / "text"
    image_dir = source_dir / "images"
    page_dir = source_dir / "page-renders"
    text_dir.mkdir(parents=True, exist_ok=True)
    image_dir.mkdir(parents=True, exist_ok=True)
    if render_pages:
        page_dir.mkdir(parents=True, exist_ok=True)

    document = fitz.open(pdf_path)
    pages = []

    for page_index, page in enumerate(document, start=1):
        page_text = page.get_text("text")
        text_path = text_dir / f"page-{page_index:03}.txt"
        text_path.write_text(page_text, encoding="utf-8")

        extracted_images = []
        for image_index, image_info in enumerate(page.get_images(full=True), start=1):
            xref = image_info[0]
            image = document.extract_image(xref)
            extension = image.get("ext", "png")
            image_path = image_dir / f"page-{page_index:03}-image-{image_index:02}.{extension}"
            image_path.write_bytes(image["image"])
            extracted_images.append(str(image_path.relative_to(output_dir)))

        page_render = None
        if render_pages:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            render_path = page_dir / f"page-{page_index:03}.png"
            pixmap.save(render_path)
            page_render = str(render_path.relative_to(output_dir))

        pages.append(
            {
                "page": page_index,
                "text": str(text_path.relative_to(output_dir)),
                "embedded_images": extracted_images,
                "page_render": page_render,
            }
        )

    return {
        "source_id": source["id"],
        "year": source["year"],
        "type": source["type"],
        "set": source["set"],
        "source_url": source["url"],
        "pdf": str(pdf_path.relative_to(output_dir)),
        "page_count": len(document),
        "pages": pages,
    }


def ingest(args: argparse.Namespace) -> int:
    manifest = load_manifest(args.manifest)
    sources = official_downloadable_sources(manifest)
    local_pdfs = parse_local_pdfs(args.local_pdf)

    if args.year:
        sources = [source for source in sources if source["year"] in args.year]

    if args.source_id:
        wanted = set(args.source_id)
        sources = [source for source in sources if source["id"] in wanted]

    if args.list:
        for source in sources:
            print(f"{source['priority']:02} {source['id']} {source['url']}")
        return 0

    output_dir = args.output
    output_dir.mkdir(parents=True, exist_ok=True)

    extraction_manifest = {
        "course": manifest["course"],
        "generated_from": str(args.manifest),
        "sources": [],
    }

    for source in sources:
        source_dir = output_dir / source["id"]
        pdf_path = source_dir / "source.pdf"

        if source["id"] in local_pdfs:
            local_path = local_pdfs[source["id"]]
            if not local_path.exists():
                print(f"Missing local PDF {local_path}", file=sys.stderr)
                continue
            source_dir.mkdir(parents=True, exist_ok=True)
            print(f"Copying local PDF for {source['id']}...")
            shutil.copyfile(local_path, pdf_path)
        elif args.download:
            print(f"Downloading {source['id']}...")
            download_pdf(source["url"], pdf_path)
        elif not pdf_path.exists():
            print(f"Missing {pdf_path}. Re-run with --download.", file=sys.stderr)
            continue

        print(f"Extracting {source['id']}...")
        extraction_manifest["sources"].append(
            extract_pdf(source, pdf_path, output_dir, args.render_pages)
        )

    manifest_path = output_dir / "extraction-manifest.json"
    manifest_path.write_text(json.dumps(extraction_manifest, indent=2), encoding="utf-8")
    print(f"Wrote {manifest_path}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Index official College Board AP World History PDFs.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--year", type=int, action="append", help="Limit to one or more years.")
    parser.add_argument("--download", action="store_true", help="Download official public PDFs before extracting.")
    parser.add_argument("--local-pdf", action="append", help="Use a local PDF for a source, formatted SOURCE_ID=/path/to/file.pdf.")
    parser.add_argument("--source-id", action="append", help="Limit to one or more source ids.")
    parser.add_argument("--render-pages", action="store_true", help="Render every PDF page as a PNG.")
    parser.add_argument("--list", action="store_true", help="List downloadable official sources and exit.")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(ingest(parse_args()))
