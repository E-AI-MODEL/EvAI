# ReflectionCompiler.py

class ReflectionCompiler:
    def __init__(self, seed_memory):
        self.seed_memory = seed_memory

    def refine_trace(self, cot_trace):
        refined = []
        for step in cot_trace:
            if "aanname" in step.lower():
                refined.append(step + " → Reflectie: is deze aanname consistent met eerdere stappen?")
            else:
                refined.append(step)
        return refined

    def generate_seed_from_trace(self, cot_trace):
        if any("bias" in step.lower() for step in cot_trace):
            return {
                "id": "Seed_Bias_Reflect",
                "type": "SelfGenerated",
                "intention": "Biasherkenning",
                "emotion": "Alert",
                "ttl": "2025-12-31T00:00:00Z",
                "weight": 0.6,
                "description": "Gegenereerd via patroonreflectie op bias"
            }
        return None