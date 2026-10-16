"""Check local HTML links, media, and fragments in the built static site."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.links = []
        self.ids = set()
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.add(values["id"])
        for key in ("href", "src", "poster"):
            if values.get(key):
                self.links.append(values[key])


root = Path("dist").resolve()
assert root.is_dir(), "Run npm run build first"
documents = {path: Document(path) for path in root.rglob("*.html")}
failures = []
for path, document in documents.items():
    for link in document.links:
        url = urlsplit(link)
        if url.scheme or url.netloc or link.startswith("data:"):
            continue
        name = unquote(url.path)
        target = (root / name.lstrip("/") if name.startswith("/") else path.parent / name).resolve() if name else path
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            failures.append(f"{path.relative_to(root)}: missing {link}")
        elif url.fragment and target.suffix == ".html":
            target_doc = documents.get(target)
            if target_doc and unquote(url.fragment) not in target_doc.ids:
                failures.append(f"{path.relative_to(root)}: missing fragment {link}")
assert not failures, "\n".join(failures)
print(f"Local links, media and fragments checked across {len(documents)} HTML pages.")
