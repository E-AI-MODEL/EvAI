# roleplay_prompt_engine.py

def roleplay_reasoning(parameter, role):
    if role == "docent":
        return f"[Roleplay: Docent] Ik zou deze AI-tool inzetten om autonomie te bevorderen via {parameter}."
    elif role == "leerling":
        return f"[Roleplay: Leerling] Ik voel me geholpen door de AI wanneer {parameter} goed aansluit bij mijn doel."
    elif role == "inspecteur":
        return f"[Roleplay: Inspecteur] Er moet transparantie zijn over {parameter} binnen deze toepassing."
    return "[Roleplay] Geen rol gekozen."