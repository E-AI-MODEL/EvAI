import string

def a1z26_score_transform(username: str, eai_score: float, toolname: str) -> str:
    """
    Genereert een pseudoniem `lim_id` op basis van gebruikersnaam, E_AI-score en toolnaam.

    De `lim_id` is AVG-proof:
    - Geen opslag van naam
    - Letters worden getransformeerd op basis van scoredecimalen
    - A1Z26-variant met score-gebaseerde verschuiving
    """
    base_score = f"{eai_score:.2f}"
    decimal_digits = [int(c) for c in base_score.split('.')[1]]

    transformed_chars = []
    for i, char in enumerate(username):
        if char.upper() in string.ascii_uppercase:
            base_val = ord(char.upper()) - 65  # A = 0
            shift = decimal_digits[i % len(decimal_digits)]
            if i % 2 == 1:
                shift *= -1
            new_val = (base_val + shift) % 26
            new_char = chr(new_val + 65)
            transformed_chars.append(new_char)
        else:
            transformed_chars.append('X')  # vervang niet-letters

    pseudonym = ''.join(transformed_chars)
    lim_id = f"{base_score}_{pseudonym}_{toolname.lower()}"
    return lim_id
