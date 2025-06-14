# mirror_trace_logger.py

def mirror_feedback(trace, context):
    feedback = []
    for step in trace:
        if "context" in step.lower() and context.get("domain"):
            feedback.append(f"[Mirror] Deze stap reflecteert op het domein {context['domain']}")
        elif "assumption" in step.lower():
            feedback.append("[Mirror] Controleer of deze aanname impliciet is gebleven.")
    return feedback