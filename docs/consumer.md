
# Consumer Documentatie

De **Consumer** is verantwoordelijk voor het ontvangen en verwerken van berichten uit RabbitMQ en het genereren van class diagrammen op basis van de ontvangen tekst.

## Overzicht
1. **Berichten ophalen:**  
   De consumer luistert naar een RabbitMQ-queue en haalt berichten op zodra deze beschikbaar zijn.
2. **Tekstverwerking met OpenAI NLP:**  
   De ontvangen tekst wordt geanalyseerd met behulp van de OpenAI API om klasseninformatie te extraheren.
3. **Class diagram genereren:**  
   Met behulp van Graphviz wordt een class diagram gegenereerd en opgeslagen.

---

## Configuratie
De configuratie voor de consumer wordt ingesteld in `config.py`:
```python
# RabbitMQ configuratie
RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'speech_events'

# OpenAI API-sleutel
OPENAI_API_KEY = 'jouw-api-sleutel-hier'
```

---

## Bestandsstructuur
De consumer bestaat uit de volgende modules:

```plaintext
consumer/
├── src/
│   ├── consumer.py               # Hoofdscript van de consumer
│   ├── extract_classes.py        # Analyseert tekst met OpenAI API
│   ├── diagram_generator.py      # Genereert class diagrammen
│   ├── config.py                 # Configuratiebestand
├── tests/                        # Unit tests voor de consumer
├── requirements.txt              # Vereiste Python-pakketten
└── Dockerfile                    # Dockerconfiguratie
```

---

## Hoe te gebruiken
1. **Start RabbitMQ:**
   Zorg ervoor dat RabbitMQ actief is. Je kunt Docker Compose gebruiken:
   ```bash
   docker-compose -f broker/docker-compose.yml up -d
   ```

2. **Start de producer:**
   Zorg dat de producer berichten naar RabbitMQ stuurt, zoals:
   ```plaintext
   "Maak een formulier met velden naam, e-mail en opmerkingen."
   ```

3. **Start de consumer:**
   Draai het script:
   ```bash
   python consumer/src/consumer.py
   ```

4. **Resultaat:**
   - Het gegenereerde class diagram wordt opgeslagen als een PNG-bestand in `diagram_output/class_diagram.png`.

---

## Belangrijke functies

### **`consumer.py`**
- **`process_message(body)`:**
  Verwerkt elk bericht dat wordt ontvangen van RabbitMQ. Dit omvat:
  - Het decoderen van JSON-berichten.
  - Het aanroepen van `extract_classes_from_text_with_nlp` voor tekstanalyse.
  - Het aanroepen van `generate_class_diagram` om een class diagram te genereren.

- **`main()`:**
  Verbindt met RabbitMQ, luistert naar de queue en roept `process_message` aan voor elk ontvangen bericht.

---

### **`extract_classes.py`**
- **`extract_classes_from_text_with_nlp(text)`:**
  - Analyseert de tekst met behulp van de OpenAI API (GPT-model).
  - Retourneert een lijst met klassen, inclusief velden, methoden en relaties.

---

### **`diagram_generator.py`**
- **`generate_class_diagram(classes, output_path)`:**
  - Genereert een class diagram in PNG-formaat.
  - Ondersteunt klassen, velden, methoden en relaties.

---

## Vereisten
Zorg ervoor dat de volgende pakketten zijn geïnstalleerd:
```bash
pip install pika openai graphviz
```

---

## Testen
1. **Producer:**
   - Stuur een bericht zoals:  
     ```plaintext
     "Maak een formulier met velden naam, e-mail en opmerkingen."
     ```

2. **Consumer:**
   - Controleer de console-uitvoer om te zien of de tekst correct is geanalyseerd en of het diagram is gegenereerd.

3. **Diagram Output:**
   - Open het gegenereerde diagram in `diagram_output/class_diagram.png`.

---

## Mogelijke Uitbreidingen
1. **Complexere NLP-verwerking:**
   - Voeg extra prompts toe om relaties en klassenlogica beter te begrijpen.
2. **UI-integratie:**
   - Toon de gegenereerde diagrammen via een frontend.
3. **Database-ondersteuning:**
   - Sla de klasseninformatie op in een database voor verdere analyse.

---

Laat weten als je verdere vragen hebt of hulp nodig hebt!
