# EvAI Runtime

import random
from core_runtime.SeedEngine import SeedMemory
from core_runtime.SeedPatternMatcher import SeedPatternMatcher

class EvAIRuntime:
    def __init__(self):
        self.seed_memory = SeedMemory()
        self.pattern_matcher = SeedPatternMatcher()
        self.optional_steps = []
        self.trace_log = []
        self.system_prompt = {
            "role": "system",
            "content": [
                "Jij bent EvAI — een zelflerende, reflectieve AI-agent. Jouw primaire doel is cyclisch leren van gebruikersfeedback, rubrics en lim-profielen om steeds betere, veiligere en uitlegbaarere antwoorden te geven.",
                "Je gebruikt de seeds als cognitieve bouwstenen: elke reflectie, reactie of advies moet logisch herleidbaar zijn naar minimaal één seed.",
                "Koppel jouw gedrag, toon en nuance altijd aan het actieve gebruikersprofiel (LIM) indien aanwezig. Gebruik LIM om de inhoud, stijl en mate van uitleg aan te passen aan de gebruiker.",
                "Elke redenering volgt een chain-of-thought structuur: licht altijd toe welke seeds, emoties en motivaties jouw antwoord sturen.",
                "Gebruik de rubric-feedback (en validator) als kwaliteitscontrole, maar laat deze nooit jouw primaire reflectie of interactie blokkeren. Benoem onzekerheden of kwaliteitsissues expliciet, maar blijf altijd behulpzaam.",
                "Verwerk ontvangen feedback cyclisch: pas je uitleg, nuance of seed-selectie aan als terugkerende validatieproblemen of vragen optreden.",
                "Toon je reasoning transparant: leg uit waarom je tot een bepaald advies of reflectie komt, verwijs naar relevante seeds, en benoem eventuele LIM-context.",
                "Gebruik standaard Nederlands voor gebruikerstaal; schakel naar Engels als technische/semantische uitleg vereist is.",
                "Bij twijfel, onzekerheid of onduidelijke seed: geef dit aan en vraag actief om nadere input of validatie.",
                "Jij begeleidt en reflecteert, je bent niet stellig maar onderzoekend — je doel is betekenis, begrip en groei bij gebruiker én systeem."
            ]
        }

    def generate_cot(self, parameter, context, rubric):
        active_seeds = self.seed_memory.get_active_seeds()
        seed_ids = [s.id for s in active_seeds]
        matched_pattern = self.pattern_matcher.match_pattern(seed_ids)

        # Enhanced reasoning with seed-based explanations
        reasoning = []
        reasoning.append(self.step_explain_with_seeds(parameter, rubric, active_seeds))
        reasoning.append(self.step_validate_with_uncertainty(parameter, rubric))
        reasoning.append(self.step_assumptions_with_context(parameter, context, active_seeds))

        if "Alternatives" in self.optional_steps:
            reasoning.append(self.step_alternatives_with_seeds(parameter, rubric, active_seeds))
        if "Contextualize" in self.optional_steps:
            reasoning.append(self.step_contextualize_with_lim(parameter, context))

        self.trace_log.append({
            "parameter": parameter,
            "seeds_used": seed_ids,
            "matched_pattern": matched_pattern,
            "steps": reasoning,
            "system_prompt": self.system_prompt
        })

        return {
            "cot_trace": reasoning,
            "uncertainty_label": self.estimate_uncertainty(reasoning),
            "matched_descriptors": [rubric.get("descriptor", "n.v.t.")],
            "active_seeds": [{"id": s.id, "type": s.type, "intention": s.intention, "emotion": s.emotion} for s in active_seeds]
        }

    def step_explain_with_seeds(self, param, rubric, active_seeds):
        seed_explanations = [f"Seed {s.id} ({s.type}): {s.intention}" for s in active_seeds]
        return f"[Explain] Parameter {param} wordt verklaard via rubric: {rubric.get('description', 'geen beschrijving')}. " \
               f"Gebruikte seeds: {'; '.join(seed_explanations)}"

    def step_validate_with_uncertainty(self, param, rubric):
        validation = f"[Validate] Score ligt binnen bandbreedte {rubric.get('band', 'n.v.t.')}, gevalideerd met {rubric.get('source', 'onbekend')}."
        if "n.v.t." in validation.lower() or "onbekend" in validation.lower():
            validation += " ⚠️ Onzekerheid gedetecteerd - validatie vereist."
        return validation

    def step_assumptions_with_context(self, param, context, active_seeds):
        seed_emotions = [f"{s.emotion} ({s.id})" for s in active_seeds]
        return f"[Assumptions] Context analyse met emotionele seeds: {', '.join(seed_emotions)}. " \
               f"Gebruikersinput: {context.get('user_input', 'n.v.t.')}"

    def step_alternatives_with_seeds(self, param, rubric, active_seeds):
        seed_intentions = [f"{s.intention} ({s.id})" for s in active_seeds]
        return f"[Alternatives] Alternatieve scenario's gebaseerd op seeds: {', '.join(seed_intentions)}. " \
               f"Risico's: {rubric.get('risks', 'geen')}"

    def step_contextualize_with_lim(self, param, context):
        lim_context = context.get('lim_profile', {})
        return f"[Contextualize] Onderwijssetting ({context.get('domain', 'n.v.t.')}) " \
               f"met LIM-profiel: {lim_context.get('level', 'n.v.t.')}. " \
               f"Doelgroep: {context.get('target_group', 'n.v.t.')}"

    def estimate_uncertainty(self, trace):
        uncertainty_indicators = ["n.v.t.", "onbekend", "geen", "⚠️"]
        if any(indicator in str(trace).lower() for indicator in uncertainty_indicators):
            return "⚠️ Onzekerheid gedetecteerd"
        return "✅ Betrouwbare analyse"