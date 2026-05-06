import argparse
import html
import json
import re
import ssl
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "data/third-party/highschooltestprep-ap-world-history.json"
DEFAULT_OUTPUT = ROOT / "content-cache/third-party/highschooltestprep-ap-world-history"


class TextAndImageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.images: list[dict[str, str]] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {key: value or "" for key, value in attrs}
        if tag in {"script", "style", "noscript"}:
            self._skip_depth += 1
            return
        if self._skip_depth:
            return
        if tag in {"h1", "h2", "h3", "h4", "p", "li", "div", "section", "article", "br"}:
            self.parts.append("\n")
        if tag == "img":
            self.images.append(
                {
                    "src": attrs_dict.get("src", ""),
                    "alt": attrs_dict.get("alt", ""),
                }
            )
            self.parts.append(f"\n[Image: {attrs_dict.get('alt', '').strip()}]\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._skip_depth:
            self._skip_depth -= 1
        elif not self._skip_depth and tag in {"h1", "h2", "h3", "h4", "p", "li", "div", "section", "article"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self._skip_depth:
            cleaned = " ".join(html.unescape(data).split())
            if cleaned:
                self.parts.append(cleaned)

    def text(self) -> str:
        joined = "\n".join(self.parts)
        joined = re.sub(r"\n{3,}", "\n\n", joined)
        return joined.strip()


def fetch(url: str, allow_insecure_ssl: bool) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "Xanvera source reviewer"})
    context = ssl._create_unverified_context() if allow_insecure_ssl else None
    with urllib.request.urlopen(request, timeout=30, context=context) as response:
        return response.read().decode("utf-8", errors="replace")


def load_manifest(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def extract_question_blocks(text: str) -> list[dict[str, str]]:
    pattern = re.compile(r"(?=Question\s+\d+\s+of\s+\d+)", re.IGNORECASE)
    chunks = [chunk.strip() for chunk in pattern.split(text) if chunk.strip().lower().startswith("question")]
    return [{"raw_text": chunk} for chunk in chunks]


def scrape(args: argparse.Namespace) -> int:
    manifest = load_manifest(args.manifest)
    output = args.output
    output.mkdir(parents=True, exist_ok=True)

    wanted = set(args.page_id or [])
    pages = manifest["pages"]
    if wanted:
        pages = [page for page in pages if page["id"] in wanted]

    index = {
        "source": manifest["source"],
        "usage_policy": manifest["usage_policy"],
        "pages": [],
    }

    for page in pages:
        print(f"Fetching {page['id']}...")
        page_dir = output / page["id"]
        page_dir.mkdir(parents=True, exist_ok=True)
        raw_html = fetch(page["url"], args.allow_insecure_ssl)
        (page_dir / "raw.html").write_text(raw_html, encoding="utf-8")

        parser = TextAndImageParser()
        parser.feed(raw_html)
        page_text = parser.text()
        (page_dir / "text.txt").write_text(page_text, encoding="utf-8")

        questions = extract_question_blocks(page_text)
        (page_dir / "questions-raw.json").write_text(json.dumps(questions, indent=2), encoding="utf-8")

        index["pages"].append(
            {
                "id": page["id"],
                "title": page["title"],
                "url": page["url"],
                "raw_html": str((page_dir / "raw.html").relative_to(output)),
                "text": str((page_dir / "text.txt").relative_to(output)),
                "questions_raw": str((page_dir / "questions-raw.json").relative_to(output)),
                "image_count": len(parser.images),
                "question_block_count": len(questions),
                "images": parser.images,
            }
        )

    (output / "scrape-index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
    print(f"Wrote {output / 'scrape-index.json'}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape High School Test Prep AP World pages into local review cache.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--page-id", action="append", help="Limit to one or more page ids.")
    parser.add_argument("--allow-insecure-ssl", action="store_true", help="Bypass local certificate validation for public review scraping.")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(scrape(parse_args()))
