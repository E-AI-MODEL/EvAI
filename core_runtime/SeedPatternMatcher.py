# SeedPatternMatcher.py

import json

class SeedPatternMatcher:
    def __init__(self, pattern_file="SeedTraceGraph_demo.json"):
        self.pattern_file = pattern_file
        self.patterns = self.load_patterns()

    def load_patterns(self):
        with open(self.pattern_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def match_pattern(self, current_seed_ids):
        for pattern in self.patterns:
            if pattern.get("Pattern") == current_seed_ids:
                return pattern
        return None

    def find_patterns(self, seeds):
        """Return a list of patterns matching the provided seed objects."""
        ids = [s["id"] if isinstance(s, dict) else getattr(s, "id", None) for s in seeds]
        matches = []
        for pattern in self.patterns:
            pattern_ids = pattern.get("Pattern", [])
            if all(pid in ids for pid in pattern_ids):
                matches.append(pattern)
        return matches
