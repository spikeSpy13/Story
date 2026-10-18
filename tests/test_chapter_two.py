import gzip
import hashlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/sources/chapter-02"


class ChapterTwoFidelityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.chapter = json.loads((ROOT / "src/content/chapter-02.json").read_text())
        cls.paragraphs = [json.loads(line) for line in (SOURCE / "paragraphs.jsonl").read_text().splitlines()]
        cls.elements = [json.loads(line) for line in (SOURCE / "elements.jsonl").read_text().splitlines()]
        cls.structure = json.loads((SOURCE / "structure.json").read_text())

    def test_all_141_paragraphs_match_source_in_order_and_styles_reconstruct_text(self):
        self.assertEqual(len(self.chapter["paragraphs"]), 141)
        self.assertEqual([(p["paragraph_id"], p["paragraph_global_order"], p["text_clean"]) for p in self.paragraphs],
                         [(p["id"], p["order"], p["text"]) for p in self.chapter["paragraphs"]])
        sections = {s["sourceId"]: s["id"] for s in self.chapter["sections"]}
        for original, paragraph in zip(self.paragraphs, self.chapter["paragraphs"]):
            self.assertEqual("".join(s["text"] for s in paragraph["segments"]), paragraph["text"])
            self.assertEqual(paragraph["section"], sections[original["section_id"]])
            self.assertEqual(paragraph["pages"], sorted({s["page_index"] + 1 for s in original["source_spans"]}))
        self.assertEqual(self.chapter["sourceOverrides"], [])

    def test_four_sections_and_19_subsections_preserve_titles_and_hierarchy(self):
        originals = [n for n in self.structure["nodes"] if n["kind"] in ("section", "subsection")]
        sections = self.chapter["sections"]
        self.assertEqual(len(sections), 23)
        self.assertEqual(sum(s["parent"] == "2" for s in sections), 4)
        self.assertEqual([s["title"] for s in sections], [s["title"] for s in originals])
        ids = {s["sourceId"]: s["id"] for s in sections}
        ids[self.paragraphs[0]["chapter_id"]] = "2"
        for source, section in zip(originals, sections):
            self.assertEqual(section["parent"], ids[source["parent_id"]])
            self.assertEqual(section["level"], 3 if source["kind"] == "subsection" else 2)

    def test_six_notes_include_standalone_asterisk_and_five_exact_calls(self):
        originals = [e for e in self.elements if e["kind"] == "endnote"]
        self.assertEqual(len(self.chapter["notes"]), 6)
        self.assertEqual([f"{n['number']} {n['text']}" for n in self.chapter["notes"]], [n["text_clean"] for n in originals])
        expected = {(e["paragraph_id"], start, end): e["note_number"] for e in self.elements
                    if e["kind"] == "note_call" for start, end in e["text_clean_ranges"]}
        actual = {}
        for p in self.chapter["paragraphs"]:
            offset = 0
            for segment in p["segments"]:
                end = offset + len(segment["text"])
                if segment["note"]:
                    actual[p["id"], offset, end] = segment["note"]
                offset = end
        self.assertEqual(len(actual), 5)
        self.assertEqual(expected, actual)
        asterisk = next(n for n in self.chapter["notes"] if n["number"] == "*")
        self.assertEqual(asterisk["paragraphs"], [])
        self.assertEqual(asterisk["section"], "2.4.3")

    def test_quote_and_source_typographic_emphasis(self):
        expected = {e["paragraph_id"] for e in self.elements if e["kind"] == "block_quote"}
        actual = {p["id"] for p in self.chapter["paragraphs"] if p["quote"]}
        self.assertEqual(len(expected), 1)
        self.assertEqual(actual, expected)
        classic = self.chapter["paragraphs"][62]
        self.assertTrue(classic["text"].startswith("DESIGN CLÁSSICO"))
        self.assertGreater(sum(len(s["text"]) for s in classic["segments"] if s["bold"]) / len(classic["text"]), .95)
        self.assertTrue(any(s["italic"] and "Minitrama" in s["text"] for s in self.chapter["paragraphs"][64]["segments"]))

    def test_pdf_and_compressed_source_integrity(self):
        expected = "37e23acaa87fd93274e25a6654f34fd93815f05381cccc3c88875a63704cb210"
        for path in [SOURCE / "original.pdf", ROOT / "public/content/chapter-02.pdf"]:
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), expected)
        metadata = json.loads((SOURCE / "metadata.json").read_text())
        raw = gzip.decompress((SOURCE / "pages_raw.jsonl.gz").read_bytes())
        self.assertEqual(hashlib.sha256(raw).hexdigest(), metadata["processing"]["raw_pages_sha256"])
        self.assertEqual(self.chapter["source"]["pages"], 35)

    def test_three_original_diagrams_have_source_order_and_integrity(self):
        figures = json.loads((ROOT / "src/content/chapter-02-illustrations.json").read_text())["placements"]
        expected = [(14, 65), (24, 102), (26, 107)]
        paragraphs = {p["id"]: p for p in self.chapter["paragraphs"]}
        self.assertEqual([(f["sourcePage"], paragraphs[f["afterParagraph"]]["order"]) for f in figures], expected)
        for figure in figures:
            path = ROOT / "public" / figure["src"].lstrip("/")
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), figure["sha256"])
            self.assertEqual(figure["kind"], "diagram")


if __name__ == "__main__":
    unittest.main()
