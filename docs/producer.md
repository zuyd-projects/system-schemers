
# Producer Documentatie

De **Producer** is verantwoordelijk voor het opnemen van spraak, het converteren naar tekst via de OpenAI Whisper API, en het verzenden van de gegenereerde berichten naar RabbitMQ.

## Overzicht
1. **Spraak-naar-tekst:** De producer gebruikt de OpenAI Whisper API om spraak om te zetten naar tekst.
2. **Event generatie:** Het resultaat wordt verpakt in een JSON-event.
3. **Berichten verzenden:** Het event wordt gepubliceerd naar een specifieke RabbitMQ-queue.

## Configuratie
De configuratie voor de producer wordt ingesteld in `config.py`:
```python
# RabbitMQ configuratie
RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'speech_events'

# OpenAI API-sleutel
OPENAI_API_KEY = 'jouw-api-sleutel-hier'
```

### Vereisten
- **Python-pakketten:**
  Zorg dat de volgende pakketten zijn geïnstalleerd:
  ```bash
  pip install pika openai
  ```
- **RabbitMQ:**  
  Zorg ervoor dat een RabbitMQ-server actief is.

## Hoe te gebruiken
1. **Start RabbitMQ:**
   Gebruik Docker Compose om RabbitMQ te starten:
   ```bash
   docker-compose -f broker/docker-compose.yml up -d
   ```

2. **Zorg voor een audiobestand:**
   Plaats een audiobestand genaamd `input_audio.wav` in de map `producer/audio/`.

3. **Start de producer:**
   Draai het script:
   ```bash
   python producer/src/producer.py
   ```

4. **Verwachte output:**
   - Het script leest het audiobestand, converteert het naar tekst, en stuurt een bericht naar RabbitMQ:
     ```plaintext
     Producer gestart. Spraakinvoer verwerken...
     Spreek een opdracht in...
     Herkenning voltooid: Ik wil graag een formulier met de velden e-mail, naam en overige opmerkingen.
     [x] Bericht verstuurd: {"event_type": "speech_to_text", "payload": {"text": "Ik wil graag een formulier met de velden e-mail, naam en overige opmerkingen."}}
     ```

## Belangrijke functies
- **`transcribe_speech`:**  
  Zet spraak om naar tekst met behulp van de OpenAI Whisper API.
- **`send_to_broker`:**  
  Verzendt het gegenereerde bericht naar RabbitMQ.

## Foutafhandeling
- Als het audiobestand niet wordt gevonden:
  ```plaintext
  Audio bestand niet gevonden: ../audio/input_audio.wav
  ```
- Als de verbinding met RabbitMQ mislukt:
  Controleer of RabbitMQ actief is en of de configuratie correct is.

## Volgende stappen
- Integreer met een frontend om spraakopname dynamisch te starten.
- Voeg automatische retries toe voor RabbitMQ-verbindingen.
