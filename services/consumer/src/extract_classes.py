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
    Analyze the following text and generate a JSON list with class information. 
    For each class:
    - Provide the name of the class. (Ensure it is specific, relevant to the domain, in English, and uses CamelCase.)
    - Avoid generic class names such as "Application", "System", or other non-specific terms.
    - Ensure the classes represent concrete concepts or entities mentioned in the text, not abstract ideas or generalizations.
    - Provide the fields (with name and type). (Ensure they are specific to the context and in English.)
    - Provide the methods. (Ensure they are specific to the context and in English.)
    - Provide the relationships with other classes (e.g., 'contains', 'uses'). (Ensure they are specific to the context and in English.)
    - If a term like "application" is mentioned, focus on its components (e.g., entities it manages) rather than treating it as a standalone class.

    Text: "{text}"

    Example output:
    [
        {{
            "name": "WarhammerUnit",
            "fields": ["name: str", "type: str", "vehicle: str"],
            "methods": ["addUnit", "removeUnit"],
            "relations": [
                {{"target": "Leaderboard", "type": "uses"}}
            ]
        }},
        {{
            "name": "Leaderboard",
            "fields": ["ranking: list", "unitStats: dict"],
            "methods": ["addScore", "resetLeaderboard"],
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