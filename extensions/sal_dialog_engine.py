# sal_dialog_engine.py

SAL_DIMENSIONS = ["Transparantie", "Menselijk toezicht", "Controleerbaarheid", "Autonomie", "Biasbeheer"]

def sal_analysis(context, cot_trace):
    sal_result = {}
    for dim in SAL_DIMENSIONS:
        sal_result[dim] = "✓" if any(dim.lower() in step.lower() for step in cot_trace) else "⚠️"
    return sal_result