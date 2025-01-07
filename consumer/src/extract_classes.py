import openai
import json
from config import OPENAI_API_KEY

# Stel de OpenAI API-sleutel in
openai.api_key = OPENAI_API_KEY

def extract_classes_from_text_with_nlp(text):
    """
    Gebruik OpenAI NLP om klasseninformatie uit tekst te halen.
    Args:
        text (str): De tekst waarin klasseninformatie wordt gezocht.
    Returns:
        list of dict: Een lijst van klassen met velden, methoden en relaties.
    """
    prompt = f"""
    Analyseer de volgende tekst en genereer een JSON-lijst met klasseninformatie. 
    Voor elke klasse:
    - Geef de naam van de klasse.
    - Geef de velden (met naam en type).
    - Geef de methoden.
    - Geef de relaties met andere klassen (bijvoorbeeld 'contains', 'uses').

    Tekst: "{text}"

    Outputvoorbeeld:
    [
        {{
            "name": "Formulier",
            "fields": ["naam: str", "email: str", "opmerkingen: str"],
            "methods": ["validate", "submit"],
            "relations": [
                {{"target": "Veld", "type": "contains"}}
            ]
        }},
        {{
            "name": "Veld",
            "fields": ["label: str", "waarde: Any"],
            "methods": ["render"],
            "relations": []
        }}
    ]
    """

    try:
        response = openai.completions.create(
            model="gpt-3.5-turbo-instruct", 
            prompt=prompt,
            max_tokens=500,
            temperature=0
        )
        # Correcte toegang tot de response
        output_text = response.choices[0].text.strip()
        classes = json.loads(output_text)
        return classes
    except json.JSONDecodeError as e:
        print(f"Fout bij decoderen van JSON-output: {e}")
        return []
    except Exception as e:
        print(f"Fout bij gebruik van OpenAI NLP: {e}")
        return []