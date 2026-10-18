import hashlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/sources/chapter-01"


class FidelityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.chapter = json.loads((ROOT / "src/content/chapter-01.json").read_text())
        cls.paragraphs = [json.loads(s) for s in (SOURCE / "paragraphs.jsonl").read_text().splitlines()]
        cls.elements = [json.loads(s) for s in (SOURCE / "elements.jsonl").read_text().splitlines()]
        cls.structure = json.loads((SOURCE / "structure.json").read_text())

    def test_every_paragraph_matches_source_in_order(self):
        def faithful_text(p):
            amendments = [t for t in p["transformations"] if t["operation"] == "apply_reviewed_editorial_amendment"]
            return amendments[0]["before"] if amendments else p["text_clean"]
        source = [(p["paragraph_id"], p["paragraph_global_order"], faithful_text(p)) for p in self.paragraphs]
        actual = [(p["id"], p["order"], p["text"]) for p in self.chapter["paragraphs"]]
        self.assertEqual(len(source), 72)
        self.assertEqual(source, actual)
        for p in self.chapter["paragraphs"]:
            self.assertEqual("".join(s["text"] for s in p["segments"]), p["text"])

    def test_headings_and_hierarchy_match_source(self):
        source = [n for n in self.structure["nodes"] if n["kind"] in ("section", "subsection")]
        actual = self.chapter["sections"]
        self.assertEqual([n["title"] for n in source], [n["title"] for n in actual])
        ids = {n["sourceId"]: n["id"] for n in actual}
        ids[self.paragraphs[0]["chapter_id"]] = "1"
        for original, displayed in zip(source, actual):
            self.assertEqual(ids[original["parent_id"]], displayed["parent"])
        self.assertEqual([n["id"] for n in actual], ["1.1", "1.2", "1.3", "1.3.1", "1.4", "1.5", "1.6"])

    def test_all_six_notes_and_call_positions_are_preserved(self):
        originals = {e["note_number"]: e for e in self.elements if e["kind"] == "endnote"}
        self.assertEqual(len(self.chapter["notes"]), 6)
        for note in self.chapter["notes"]:
            self.assertEqual(f"{note['number']} {note['text']}", originals[note["number"]]["text_clean"])
        expected = {}
        for e in self.elements:
            if e["kind"] == "note_call":
                for start, end in e["text_clean_ranges"]:
                    expected[(e["paragraph_id"], start, end)] = e["note_number"]
        actual = {}
        for p in self.chapter["paragraphs"]:
            offset = 0
            for s in p["segments"]:
                end = offset + len(s["text"])
                if s["note"]:
                    actual[(p["id"], offset, end)] = s["note"]
                offset = end
        self.assertEqual(expected, actual)

    def test_all_four_block_quotes_are_preserved(self):
        expected = {e["paragraph_id"] for e in self.elements if e["kind"] == "block_quote"}
        actual = {p["id"] for p in self.chapter["paragraphs"] if p["quote"]}
        self.assertEqual(len(expected), 4)
        self.assertEqual(expected, actual)

    def test_italic_emphasis_survives_reflow(self):
        segments = self.chapter["paragraphs"][1]["segments"]
        self.assertTrue(any(s["text"] == "Ética" and s["italic"] for s in segments))
        for p in self.chapter["paragraphs"]:
            if p["quote"]:
                self.assertGreater(sum(len(s["text"]) for s in p["segments"] if s["italic"]) / len(p["text"]), .95)

    def test_pdf_is_the_unchanged_supplied_document(self):
        expected = "dabd10538ffdc866c6fa24187ffb1b9f784f647a01d5286a9c6a91cd7015633d"
        for path in [SOURCE / "original.pdf", ROOT / "public/content/chapter-01.pdf"]:
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), expected)

    def test_visible_pdf_spelling_overrides_editorial_correction(self):
        p = self.chapter["paragraphs"][63]
        self.assertIn("pré-requisi-tos", p["text"])
        self.assertEqual(len(self.chapter["sourceOverrides"]), 1)
        self.assertEqual(self.chapter["sourceOverrides"][0]["paragraphId"], p["id"])


if __name__ == "__main__":
    unittest.main()
