from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)
import os
from config import OPENAI_API_KEY

def transcribe_speech():
    """
    Converteert spraak naar tekst met de OpenAI Whisper API (v1.0.0+).
    """
    print("Spreek een opdracht in...")

    # Pad naar het audiobestand
    audio_dir = os.path.join(os.path.dirname(__file__), '../audio/')
    audio_file_path = os.path.join(audio_dir, "input_audio.wav")

    # Controleer of het bestand bestaat
    if not os.path.exists(audio_file_path):
        print(f"Audio bestand niet gevonden: {audio_file_path}")
        return None

    # Laad de API-sleutel

    # Upload het audiobestand en stuur het naar de Whisper API
    try:
        with open(audio_file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
            print(f"Herkenning voltooid: {response.text}")
            return response.text
    except Exception as e:
        print(f"Fout bij transcriptie: {e}")
        return None