# SeedWriter.py

import datetime

def generate_seed_from_user_behavior(parameter, trace_summary):
    return {
        "id": f"Seed_Gen_{parameter}",
        "type": "RuntimeGenerated",
        "intention": f"Nieuwe reflectie op {parameter}",
        "emotion": "Adaptief",
        "ttl": "2026-01-01T00:00:00Z",
        "weight": 0.7,
        "description": f"Gegenereerd op basis van gebruikersgedrag en semantische analyse: {trace_summary}"
    }