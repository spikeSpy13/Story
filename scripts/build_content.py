"""Build display content from the supplied corpus without rewriting its wording."""
import gzip
import hashlib
import json
import shutil
from collections import Counter
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/sources/chapter-01"
OUTPUT = ROOT / "public/content"
DATA_OUTPUT = ROOT / "src/content"


def records(name):
    return [json.loads(line) for line in (SOURCE / name).read_text().splitlines() if line.strip()]


def generate():
    paragraphs = records("paragraphs.jsonl")
    elements = records("elements.jsonl")
    structure = json.loads((SOURCE / "structure.json").read_text())
    metadata = json.loads((SOURCE / "metadata.json").read_text())
    pdf_hash = hashlib.sha256((SOURCE / "original.pdf").read_bytes()).hexdigest()
    if pdf_hash != metadata["sha256"]:
        raise ValueError("The source PDF does not match the supplied metadata")

    # Source font spans use block-relative offsets; normalization maps connect
    # those offsets to the reflowed reading text, including cross-page paragraphs.
    with gzip.open(SOURCE / "pages_raw.jsonl.gz", "rt") as f:
        pages = [json.loads(line) for line in f if line.strip()]
    fonts = {}
    for page in pages:
        for block in page["blocks"]:
            if block.get("type") != "text":
                continue
            raw = block["text_raw"]
            style = [(False, False)] * len(raw)
            cursor = 0
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"]
                    if not text:
                        continue
                    start = raw.find(text, cursor)
                    if start < 0:
                        raise ValueError(f"Cannot locate source font span: {block['block_id']}")
                    end = start + len(text)
                    name = span["font"].lower()
                    value = (bool(span["flags"] & 2) or "italic" in name,
                             bool(span["flags"] & 16) or "bold" in name)
                    style[start:end] = [value] * len(text)
                    cursor = end
            fonts[(page["page_index"], block["block_id"])] = style

    nodes = [n for n in structure["nodes"] if n["kind"] in ("chapter", "section", "subsection")]
    ids = {nodes[0]["node_id"]: "1"}
    counts = Counter()
    for n in nodes[1:]:
        counts[n["parent_id"]] += 1
        ids[n["node_id"]] = f"{ids[n['parent_id']]}.{counts[n['parent_id']]}"

    calls = {p["paragraph_id"]: [] for p in paragraphs}
    for e in elements:
        if e["kind"] == "note_call":
            calls[e["paragraph_id"]].append(e)
    quotes = {e["paragraph_id"] for e in elements if e["kind"] == "block_quote"}
    rendered = []
    source_overrides = []
    for p in sorted(paragraphs, key=lambda x: x["paragraph_global_order"]):
        text = p["text_clean"]
        styles = [(False, False)] * len(text)
        for m in p["normalization_map"]:
            candidates = []
            for ref in m["source_refs"]:
                source_styles = fonts[(ref["page_index"], ref["block_id"])]
                candidates.extend(source_styles[ref["block_char_start"]:ref["block_char_end"]])
            start, end = m["clean_start"], m["clean_end"]
            if len(candidates) == end - start:
                styles[start:end] = candidates
            elif candidates:
                styles[start:end] = [Counter(candidates).most_common(1)[0][0]] * (end - start)

        # The supplied corpus corrected an internal hyphen in "pré-requisi-tos".
        # Restore reviewed editorial changes to the visible PDF wording; retain
        # layout reflow. The original corpus files remain untouched.
        for change in reversed(p["transformations"]):
            if change["operation"] != "apply_reviewed_editorial_amendment":
                continue
            assert text == change["after"]
            assert not calls[p["paragraph_id"]], "Review note offsets before reversing an amendment"
            restored = change["before"]
            restored_styles = []
            for operation, a, b, c, d in SequenceMatcher(None, text, restored).get_opcodes():
                if operation == "equal":
                    restored_styles.extend(styles[a:b])
                else:
                    value = styles[a] if a < len(styles) else styles[-1]
                    restored_styles.extend([value] * (d - c))
            source_overrides.append({"paragraphId": p["paragraph_id"],
                                     "reason": "Preserve visible PDF wording rather than the supplied corpus editorial correction",
                                     "corpusText": text, "displayText": restored})
            text, styles = restored, restored_styles

        note_at = {}
        for call in calls[p["paragraph_id"]]:
            for start, end in call["text_clean_ranges"]:
                assert text[start:end] == call["note_number"]
                for i in range(start, end):
                    note_at[i] = call["note_number"]
        segments = []
        for i, char in enumerate(text):
            italic, bold = styles[i]
            attrs = {"italic": italic, "bold": bold, "note": note_at.get(i)}
            if segments and all(segments[-1][k] == v for k, v in attrs.items()):
                segments[-1]["text"] += char
            else:
                segments.append({"text": char, **attrs})
        assert "".join(s["text"] for s in segments) == text
        rendered.append({
            "id": p["paragraph_id"], "order": p["paragraph_global_order"],
            "section": ids[p["section_id"]], "text": text, "segments": segments,
            "quote": p["paragraph_id"] in quotes,
            "pages": sorted({s["page_index"] + 1 for s in p["source_spans"]}),
        })

    notes = []
    for e in sorted((e for e in elements if e["kind"] == "endnote"), key=lambda e: int(e["note_number"])):
        prefix = e["note_number"] + " "
        assert e["text_clean"].startswith(prefix)
        notes.append({"number": e["note_number"], "text": e["text_clean"][len(prefix):],
                      "paragraphs": e["anchor_paragraph_ids"]})

    result = {
        "id": "1", "title": nodes[0]["title"],
        "source": {"pdf": "/content/chapter-01.pdf", "sha256": pdf_hash,
                   "pages": metadata["page_count"], "corpusVersion": metadata["corpus_version"]},
        "sections": [{"id": ids[n["node_id"]], "sourceId": n["node_id"],
                      "parent": ids[n["parent_id"]], "title": n["title"],
                      "level": 3 if n["kind"] == "subsection" else 2} for n in nodes[1:]],
        "paragraphs": rendered, "notes": notes,
        "sourceOverrides": source_overrides,
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    DATA_OUTPUT.mkdir(parents=True, exist_ok=True)
    (DATA_OUTPUT / "chapter-01.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    shutil.copyfile(SOURCE / "original.pdf", OUTPUT / "chapter-01.pdf")
    print(f"Chapter 1: {len(rendered)} paragraphs, {len(result['sections'])} headings, {len(notes)} notes.")


if __name__ == "__main__":
    generate()
