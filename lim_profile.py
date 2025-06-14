# eai_core/lim_profile.py

import json
import os
import datetime


def a1z26_encode(s: str) -> list:
    """Zet een string om naar een A1Z26-vector (a=1, ..., z=26), hoofdletters als kleine letters."""
    return [ord(c.lower()) - 96 for c in s if c.isalpha()]


def apply_score_transformation(vector, eai_score):
    """Transformeert vector met afwisselend +X, -X patroon op basis van eai_score decimals."""
    decimal = str(eai_score).split(".")[-1]
    if len(decimal) == 0:
        decimal = "1"
    n = int(decimal[0]) or 1
    transformed = []
    pattern = [+n, -n]
    for i, val in enumerate(vector):
        new_val = val + pattern[i % 2]
        if new_val < 1:
            new_val = 26
        elif new_val > 26:
            new_val = ((new_val - 1) % 26) + 1
        transformed.append(new_val)
    return transformed


def generate_lim_id(eai_score: float, toolname: str, username: str) -> str:
    combined = f"{int(eai_score * 100):03}{toolname}{username}"
    base_vector = a1z26_encode(combined)
    transformed = apply_score_transformation(base_vector, eai_score)
    lim_id = f"{eai_score:.2f}-" + "-".join(map(str, transformed))
    return lim_id


def build_lim_profile(inputs: dict) -> dict:
    """Bouwt een compleet LIM-profiel op basis van inputvelden."""
    profile = {
        "lim_id": inputs["lim_id"],
        "timestamp_start": inputs.get("timestamp_start", str(datetime.datetime.utcnow())),
        "timestamp_end": inputs.get("timestamp_end", str(datetime.datetime.utcnow())),
        "context_input": "REDACTED",  # pseudoniem, elders opgeslagen
        "preliminary_estimate": inputs.get("preliminary_estimate"),
        "scores_final": inputs.get("scores_final"),
        "chain_of_thought": inputs.get("chain_of_thought"),
        "flags_active": inputs.get("flags_active"),
        "parameter_relations": inputs.get("parameter_relations"),
        "td_analysis": inputs.get("td_analysis"),
        "compliance_check": inputs.get("compliance_check"),
        "advice_outcome": inputs.get("advice_outcome"),
        "lim_vector_numeriek": inputs.get("lim_vector_numeriek"),
        "lim_vector_semantisch": inputs.get("lim_vector_semantisch"),
    }

    # Drift check
    try:
        pre = inputs["preliminary_estimate"]
        post = inputs["scores_final"]
        drift_detected = any(
            abs(pre.get(k, 0) - post.get(k, 0)) >= 0.2 for k in post.keys()
        )
        if drift_detected:
            profile["parameter_drift_detected"] = True
    except Exception:
        pass

    return profile


def save_lim_profile(lim_id: str, profile: dict, directory="data/lim_data") -> str:
    """Slaat het LIM-profiel als JSON-bestand op, op basis van lim_id."""
    os.makedirs(directory, exist_ok=True)
    filename = os.path.join(directory, f"{lim_id}.json")
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2)
    return filename
