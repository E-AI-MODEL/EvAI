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
            pattern_ids = pattern.get("pattern") or pattern.get("Pattern")
            if not pattern_ids:
                continue
            # direct match or subset match
            if set(pattern_ids).issubset(set(current_seed_ids)):
                return pattern
        return None

    def find_patterns(self, seeds):
        """Return a list of patterns matching the given seeds.

        Parameters
        ----------
        seeds : list
            A list of seed objects or dictionaries with an ``id`` field.

        Returns
        -------
        list
            All pattern entries from ``self.patterns`` where the pattern ids are
            a subset of the provided seed ids.
        """

        seed_ids = []
        for s in seeds:
            if isinstance(s, dict):
                seed_id = s.get("id")
            else:
                seed_id = getattr(s, "id", None)
            if seed_id:
                seed_ids.append(seed_id)

        matches = []
        for pattern in self.patterns:
            pattern_ids = pattern.get("pattern") or pattern.get("Pattern")
            if not pattern_ids:
                continue
            if set(pattern_ids).issubset(set(seed_ids)):
                matches.append(pattern)
        return matches
