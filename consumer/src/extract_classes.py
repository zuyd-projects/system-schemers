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
    - Provide the name of the class. (Make sure it is in English and use CamelCase)
    - Provide the fields (with name and type). (Make sure it is in English)
    - Provide the methods. (Make sure it is in English)
    - Provide the relationships with other classes (e.g., 'contains', 'uses'). (Make sure it is in English)

    Text: "{text}"

    Example output:
    [
        {{
            "name": "Form",
            "fields": ["name: str", "email: str", "comments: str"],
            "methods": ["validate", "submit"],
            "relations": [
                {{"target": "Field", "type": "contains"}}
            ]
        }},
        {{
            "name": "Field",
            "fields": ["label: str", "value: Any"],
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