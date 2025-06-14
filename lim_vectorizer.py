# eai_core/lim_vectorizer.py

import yaml
import os


def lim_vector_from_scores_and_flags(scores_final: dict, flags_active: list, domain_code: int = 0) -> list:
    """
    Genereer numerieke vector op basis van domeincode, scores en flags.
    Voorbeeld: [3, 0.8, 0.9, 0.6, 1.0, 0, 0, 1] waarbij 3 = domeincode
    """
    vector = [domain_code]
    vector.extend([round(scores_final.get(k, 0.0), 2) for k in sorted(scores_final.keys())])
    flag_vector = [1 if k in flags_active else 0 for k in sorted(scores_final.keys())]
    vector.extend(flag_vector)
    return vector


def load_semantic_mapping(spec_path: str = "config/lim_vector_spec.yaml") -> dict:
    """Laad semantische vector-mapping uit YAML-bestand."""
    if not os.path.exists(spec_path):
        raise FileNotFoundError(f"Spec bestand niet gevonden: {spec_path}")
    with open(spec_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def lim_vector_from_semantics(cot: dict, advice: list, flags: list, relations: dict, spec_path="config/lim_vector_spec.yaml") -> list:
    """
    Genereer semantische vector uit denkstappen, adviesvormen, flagtypes en relaties.
    Gebruikt een YAML mapping-spec om de posities te bepalen.
    """
    spec = load_semantic_mapping(spec_path)
    vector = []

    # CoT-patronen
    cot_map = spec.get("cot_patterns", [])
    for dim in cot_map:
        val = cot.get(dim, {}).get("score", 0)
        vector.append(round(val, 2))

    # Adviesvormen
    advice_types = spec.get("advice_types", [])
    advice_vec = [0] * len(advice_types)
    for adv in advice:
        for i, typ in enumerate(advice_types):
            if typ.lower() in adv.get("type", "").lower():
                advice_vec[i] = 1
    vector.extend(advice_vec)

    # Flags
    flag_types = spec.get("flags_risk_modes", [])
    flag_vec = [1 if ft in flags else 0 for ft in flag_types]
    vector.extend(flag_vec)

    # Relaties
    rel_keys = spec.get("relation_dynamics", [])
    for k in rel_keys:
        vector.append(1 if relations.get(k, False) else 0)

    return vector
