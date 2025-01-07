
# Consumer Documentatie

De **Consumer** is verantwoordelijk voor het ophalen en verwerken van berichten uit RabbitMQ.

## Overzicht
1. **Luistert naar RabbitMQ:**  
   De consumer luistert naar een specifieke queue en haalt berichten op zodra deze beschikbaar zijn.
2. **Berichten verwerken:**  
   Elk ontvangen bericht wordt uitgelezen en gelogd. Verdere verwerking kan eenvoudig worden toegevoegd.

## Configuratie
De configuratie voor de consumer wordt ingesteld in `config.py`:
```python
# RabbitMQ configuratie
RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'speech_events'
```

### Vereisten
- **Python-pakketten:**
  Zorg dat het volgende pakket is geïnstalleerd:
  ```bash
  pip install pika
  ```
- **RabbitMQ:**  
  Zorg ervoor dat een RabbitMQ-server actief is en dat de queue correct is geconfigureerd.

## Hoe te gebruiken
1. **Start RabbitMQ:**
   Gebruik Docker Compose om RabbitMQ te starten:
   ```bash
   docker-compose -f broker/docker-compose.yml up -d
   ```

2. **Start de consumer:**
   Draai het script:
   ```bash
   python consumer/src/consumer.py
   ```

3. **Verwachte output:**
   - Als de producer een bericht heeft verzonden, verwerkt de consumer het:
     ```plaintext
     [x] Bericht ontvangen: {"event_type": "speech_to_text", "payload": {"text": "Ik wil graag een formulier."}}
     Event Type: speech_to_text
     Payload: {'text': 'Ik wil graag een formulier.'}
     ```

## Belangrijke functies
- **`process_message`:**  
  Verwerkt elk ontvangen bericht. In de standaardimplementatie wordt het bericht naar de console gelogd.
- **`main`:**  
  Verbindt met RabbitMQ en luistert naar nieuwe berichten.

## Foutafhandeling
- **Queue bestaat niet:**  
  Zorg dat de queue in RabbitMQ overeenkomt met de configuratie in `config.py`.

- **Geen berichten ontvangen:**  
  Controleer of de producer berichten verzendt en dat RabbitMQ correct is ingesteld.

## Volgende stappen
- Breid de `process_message`-functie uit om de payload op te slaan in een database of verder te verwerken.
- Voeg logging toe om de prestaties en fouten van de consumer bij te houden.
