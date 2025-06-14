# SeedEngine.py

import datetime
import json

class Seed:
    def __init__(self, id=None, type=None, intention=None, emotion=None, ttl=None, weight=None, description=None, intention_nl=None, intention_en=None, description_nl=None, description_en=None, **kwargs):
        self.id = id
        self.type = type
        self.intention = intention
        self.emotion = emotion
        self.ttl = ttl
        self.weight = weight
        self.description = description
        self.intention_nl = intention_nl
        self.intention_en = intention_en
        self.description_nl = description_nl
        self.description_en = description_en
        self.created_at = datetime.datetime.utcnow()
        # Store any other fields
        for k, v in kwargs.items():
            setattr(self, k, v)

    def is_active(self):
        if self.ttl == "Infinity":
            return True
        if isinstance(self.ttl, str):
            try:
                ttl_time = datetime.datetime.fromisoformat(self.ttl.replace("Z", "+00:00"))
                return datetime.datetime.utcnow() < ttl_time
            except:
                return False
        return False

class SeedMemory:
    def __init__(self, seed_file="seeds_activated.json"):
        self.seed_file = seed_file
        self.seeds = self.load_seeds()

    def load_seeds(self):
        with open(self.seed_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [Seed(**item) for item in data]

    def get_active_seeds(self, context=None):
        """Return all seeds that are currently active.

        The optional ``context`` argument is accepted for compatibility with
        callers that provide additional information. It is not used in the
        default implementation.
        """
        active = [s for s in self.seeds if s.is_active()]
        return [
            {"id": s.id, "type": s.type, "intention": s.intention, "emotion": s.emotion}
            for s in active
        ]

    def find_seed(self, seed_id):
        return next((s for s in self.seeds if s.id == seed_id), None)

