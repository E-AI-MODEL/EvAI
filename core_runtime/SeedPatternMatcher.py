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
            if pattern.get("pattern") == current_seed_ids:
                return pattern
        return None

    def find_patterns(self, seeds):
        """Return patterns matching the provided seeds."""
        seed_ids = [s.get("id") for s in seeds]
        match = self.match_pattern(seed_ids)
        return [match] if match else []
