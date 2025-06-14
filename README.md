# EvAI — Reflectieve, uitlegbare AI met Seeds, LIM, Rubrics en Feedback

---

## Inhoud

- [Introductie](#introductie)
- [Doelstelling](#doelstelling)
- [Architectuur & Filosofie](#architectuur--filosofie)
- [Overzicht van Kernbestanden](#overzicht-van-kernbestanden)
- [Happy Flow (stap voor stap)](#happy-flow-stap-voor-stap)
- [LIM-profiel: de toegangspoort](#lim-profiel-de-toegangspoort)
- [Seeds: Cognitieve bouwstenen](#seeds-cognitieve-bouwstenen)
- [Rubrics & Feedbackvalidator](#rubrics--feedbackvalidator)
- [Voorbeeld van een interactie](#voorbeeld-van-een-interactie)
- [Logging & Audit](#logging--audit)
- [Edge cases, Fallbacks & Sandbox](#edge-cases-fallbacks--sandbox)
- [Governance, Privacy & Ethiek](#governance-privacy--ethiek)
- [Changelog & Roadmap](#changelog--roadmap)

---

## Introductie

EvAI is een modulaire, uitlegbare AI-agent die werkt via dynamische "seeds", persoonlijke profielen (LIM), en een valideerbare feedback- en rubric-loop. Het systeem is gebouwd om veilig, verantwoord, contextbewust en cyclisch te leren — geschikt voor educatie, reflectie, validatie en zelfsturende AI-applicaties.

---

## Doelstelling

EvAI is een zelflerende, reflectieve AI-agent die antwoorden, adviezen en reflecties formuleert op basis van dynamische seeds, gebruikersprofiel (LIM), en gevalideerde kwaliteitscriteria (rubrics). Het systeem leert cyclisch van feedback, past zijn reasoning en output aan op basis van gebruikersinteractie en validaties, en blijft ethisch, uitlegbaar en auditabel in alles wat het doet.

EvAI streeft ernaar om continu te groeien, zichzelf te verbeteren en maximaal betekenis en veiligheid te bieden voor elke gebruiker.

---

## Architectuur & Filosofie

- **Reflectief**: Elk antwoord komt voort uit een expliciete redeneerketen en is herleidbaar naar 1 of meer seeds.
- **Uitlegbaar**: Alle beslissingen, adviezen en reflecties worden voorzien van een motivatie, betrokken seeds, LIM-profiel en rubric-score.
- **Persoonlijk & veilig**: Zonder LIM-profiel geen volledige functionaliteit; alle interactie is contextbewust.
- **Cyclisch leren**: Feedback, rubric-validatie en gebruikersreacties sturen seeds, logica en output voortdurend bij.

---

## Overzicht van Kernbestanden

- `system_prompt.json` — Centrale sturingsprompt, legt het gedrag en de regels van EvAI vast.
- `seeds.json` — Alle denkmodules (seeds), tweetalig (NL/EN), met intention, emotion, type, context, TTL, tags, enz.
- `rubric_X_structured.json`, `matrix_td_structured.json` — Kwaliteitscriteria, normen, scoring- en validatiecriteria.
- `E_AI_FeedbackValidator_VOLLEDIG.ipynb`, `Master_flow.yaml` — Automatisering en logica van feedback & rubric-validatie.
- `lim_profile.py`, `lim_vectorizer.py`, `Lim_sleutel.py` — Beheer, matching en koppeling van gebruikersprofielen aan seeds.
- `SeedPatternMatcher.py`, `SeedTraceGraph_demo.json`, `mirror_trace_logger.py` — Geavanceerde reasoning, patroonherkenning, tracing en audit.
- `EAI Modulaire prompts.docx` — Modulaire promptbibliotheek, voor scenario's, rapportage, sandboxing, audit etc.

---

## Happy Flow (stap voor stap)

1. **Start van de sessie**
   - Gebruiker wordt gevraagd zijn/haar LIM-sleutel/profiel op te geven of te koppelen.
   - Zonder lim_sleutel kan EvAI alleen als "guest" functioneren (beperkte seeds, geen personalisatie).

2. **Inlezen van LIM-profiel**
   - LIM bepaalt wie de gebruiker is, met welke rechten, voorkeuren en context.
   - Seeds, uitleg, diepgang en stijl worden direct afgestemd op dit profiel.

3. **Systemprompt activeert reflectieve modus**
   - EvAI volgt altijd de regels: werken vanuit seeds, uitlegbaar, adaptief, ethisch en persoonlijk.
   - Alleen seeds met geldige context/TTL worden gebruikt.

4. **Gebruiker stelt een vraag of voert een actie uit**
   - AI analyseert input, profiel, context en kiest relevante seeds (en eventueel seed-combinaties via patterns).

5. **Reasoning & Output**
   - AI formuleert een antwoord op basis van seeds, profiel en context.
   - Chain-of-Thought: uitleg welke seeds, emoties, motivaties en LIM-context tot het antwoord leiden.

6. **Kwaliteitscontrole & Feedback**
   - Elk AI-antwoord wordt gevalideerd met rubrics, matrix en feedbackvalidator.
   - Onzekerheden, risico's, flags of validatie-issues worden expliciet benoemd.

7. **Logging, audit en cyclisch leren**
   - Alle interacties worden gelogd (beslisroute, gebruikte seeds, feedback, scores).
   - Feedback en rubric-resultaten sturen directe bijsturing van seeds en gedrag.

---

## LIM-profiel: de toegangspoort

- Gebruiker levert aan het begin van de sessie een lim_sleutel in, of maakt een profiel aan.
- LIM bevat rol, ervaring, autorisatie, context, voorkeuren.
- Seeds, advies en validatie worden altijd afgestemd op het actieve profiel.
- LIM bepaalt rechten, privileges, toon en mate van begeleiding.

---

## Seeds: Cognitieve bouwstenen

- Elk seed is een los denkblok, met:
  - intention (doel), emotion (emotie), type, context, TTL, beschrijving NL/EN, gewicht, tags.
- Seeds zijn altijd uitlegbaar en herleidbaar in output ("Deze reflectie komt voort uit Seed_0004 — Motivation").
- Seeds kunnen dynamisch worden geactiveerd, gecombineerd of tijdelijk buiten werking gesteld.

---

## Rubrics & Feedbackvalidator

- Rubrics en matrix bevatten de normen voor kwaliteit, autonomie, veiligheid, bias, ethiek, enz.
- Feedbackvalidator toetst elk AI-antwoord aan deze rubrics en geeft flags, scores en verbeterpunten.
- Cyclisch leren: seeds, uitleg of context worden automatisch aangepast op basis van validatie en feedback.

---

## Voorbeeld van een interactie

1. Gebruiker logt in en koppelt lim_sleutel.
2. Systemprompt laadt, seeds en context worden bepaald.
3. Gebruiker vraagt: "Wat kan ik doen om mijn projectdoelen te halen?"
4. EvAI activeert seeds (bijv. Motivation, Direction, Reflection) afgestemd op lim-profiel.
5. AI formuleert antwoord, noemt gebruikte seeds, legt reasoning flow uit.
6. Rubric en feedbackvalidator checken het antwoord, benoemen onzekerheden of verbeterpunten.
7. Gebruiker geeft feedback ("Te vaag", "Meer structuur graag"); AI past volgende keer uitleg/seedselectie aan.

---

## Logging & Audit

- Elke stap, seedactivatie, rubric-check, feedback en profielwissel wordt gelogd.
- Logs zijn uitlegbaar, auditabel en bruikbaar voor verbetering en compliance.

---

## Edge cases, Fallbacks & Sandbox

- Geen lim_sleutel? Systeem werkt in guest/sandbox mode: beperkte seeds, geen personalisatie.
- Onzekerheid, incomplete context of seed mismatch? AI benoemt twijfel, vraagt om verduidelijking en schakelt waar nodig fallback seeds in.
- Modulaire prompts kunnen sandboxen, quick mode, rapportages en audits ondersteunen.

---

## Governance, Privacy & Ethiek

- LIM-profielen en logs worden veilig en privacyvriendelijk beheerd.
- AI is niet stellig, benoemt altijd twijfel of risico, werkt nooit buiten seed-context.
- Elke interactie is uitlegbaar en te auditen.

---

## Local Development Setup

To run EvAI locally, you'll need Python (for the backend) and Node.js (for the frontend) installed.

### Backend (API)

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Navigate to the API directory:**
    ```bash
    cd api
    ```

3.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

4.  **Install dependencies:**
    ```bash
    pip install -r ../requirements.txt
    ```
    *Note: The requirements.txt is in the root, so we use `../requirements.txt` from the `api` directory.*

5.  **Configure environment variables:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Edit `.env` and provide the necessary values, especially for `API_KEY`. `ALLOWED_ORIGINS` defaults to allow `http://localhost:3000`.

6.  **Run the backend server:**
    The API uses Uvicorn and is configured in `main.py`.
    ```bash
    python main.py
    ```
    Or, directly with uvicorn from the `api` directory:
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The API should now be running on `http://localhost:8000`.

### Frontend

1.  **Navigate to the frontend directory (from the repository root):**
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables (optional for local development):**
    *   The frontend will attempt to connect to `http://localhost:8000` by default.
    *   If your backend is running on a different URL, copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Edit `.env` and set `REACT_APP_API_URL` to your backend's URL.

4.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The frontend should now be running on `http://localhost:3000` (or another port if 3000 is busy) and open in your default web browser.

---

## Deployment

This application is configured for deployment using [Render](https://render.com/) via the `render.yaml` file.

### Environment Variables on Render

When deploying to Render (or a similar platform), you will need to configure the following environment variables in your service settings:

**For the `evai-backend` service:**

*   `API_KEY`: **Required.** Your secret API key for accessing the backend.
*   `ALLOWED_ORIGINS`: **Required.** A comma-separated list of allowed origins for CORS. For example: `https://your-frontend-app.onrender.com,http://localhost:3000` (if you still want to allow local development access).
*   `PYTHON_VERSION`: (Already in `render.yaml`) Specifies the Python version.

**For the `evai-frontend` service:**

*   `REACT_APP_API_URL`: **Required.** The public URL of your deployed `evai-backend` service. For example: `https://your-backend-app.onrender.com`.
*   `NODE_VERSION`: (Already in `render.yaml`) Specifies the Node.js version.

Ensure these are set correctly in the Render dashboard for each service. The placeholders in `render.yaml` will be overridden by the values you set in the dashboard.

---

## Changelog & Roadmap

- Hier houd je wijzigingen, uitbreidingen en toekomstige plannen bij.
- Nieuwe seeds, rubrics, profielen of prompt-templates worden via changelog gemeld.

---

**EvAI is transparant, uitlegbaar, contextbewust, en altijd in ontwikkeling — klaar voor de toekomst van verantwoorde AI.** 