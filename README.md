
# Proof of Concept (PoC) Voorstel: Event-Driven Architectuur (EDA) voor PI6

**Versie:** 1.0  

**Auteur:** Noa Heutz

**Datum:** Tue 7 Jan

---

## 1. Inleiding  
Dit document beschrijft een Proof of Concept (PoC) voor een specifiek onderdeel van het PI6-project, gericht op de implementatie en demonstratie van een Event-Driven Architectuur (EDA). Het geselecteerde deel betreft de **Speech-to-Text en Ontwerpdefinitie Module**, die als kerncomponent fungeert in het PI6-project. De PoC illustreert de werking van de EDA door real-time verwerking van spraakinvoer naar een ontwerpdefinitie en integreert foutafhandeling en schaalbaarheid.

---

## 2. Doelen  
- **Demonstreren van EDA-principes:** Real-time verwerking van spraakgebaseerde opdrachten naar een ontwerpdefinitie.  
- **Toon schaalbaarheid aan:** Laat zien hoe asynchrone verwerking meerdere opdrachten efficiënt verwerkt.  
- **Integreer foutbeheer:** Implementeer een Dead Letter Queue (DLQ) om fouten op te vangen.  
- **Lever output aan andere modules:** Genereer een event-stroom die door andere componenten (bijvoorbeeld visualisatie) gebruikt kan worden.  

---

## 3. Scope van de PoC  
De PoC beperkt zich tot de volgende componenten:  
1. **Speech Interface (Producer):** Verwerkt spraakinvoer en genereert een event.  
2. **NLP-module (Consumer):** Verwerkt speech-events naar een JSON-gebaseerde ontwerpdefinitie.  
3. **Event Broker:** Zorgt voor distributie van events tussen modules.  
4. **Visualisatie:** Toont de gegenereerde ontwerpdefinitie als eenvoudig diagram.  
5. **Foutbeheer:** Gebruik een Dead Letter Queue om mislukte events opnieuw te proberen.  

---

## 4. Architectuur Overzicht  
**Architectuurschema:**  
```
+---------------+          +---------------+          +---------------+
| Speech Input  |  ---->   | Event Broker  |  ---->   | NLP Module    |
| (Producer)    |          | (Apache Kafka |          | (Consumer)    |
+---------------+          |  of RabbitMQ) |          +---------------+
                                |                                |
                                V                                V
                          +---------------+          +---------------+
                          | Dead Letter   |          | Visualization |
                          | Queue (DLQ)   |          | (Graphviz)    |
                          +---------------+          +---------------+
```

---

## 5. Technische Details  

### 5.1 Speech Interface (Producer)  
- **Functie:** Neemt spraakinvoer van de gebruiker en converteert dit naar tekst.  
- **Event:** JSON-payload met de spraaktekst en metadata (bijv. timestamp).  
- **Technologie:**  
  - Spraak-naar-tekst API: Google Speech-to-Text of OpenAI Whisper.  
  - Talen: Python met Flask voor eenvoudige invoerinterface.  

### 5.2 Event Broker  
- **Functie:** Zorgt voor distributie van events tussen modules.  
- **Technologie:**  
  - Apache Kafka voor schaalbaarheid en prestaties.  
  - Alternatief: RabbitMQ voor eenvoud.  

### 5.3 NLP-module (Consumer)  
- **Functie:** Verwerkt tekst naar een ontwerpdefinitie.  
- **Event:** JSON-payload met de ontwerpdefinitie (bijv. velden, knoppen).  
- **Technologie:**  
  - NLP-tool: GPT-4 API of Hugging Face Transformers.  
  - Ontwerpmodel: JSON-output die velden (bijv. naam, type) beschrijft.  

### 5.4 Visualisatie-module  
- **Functie:** Genereert een visuele representatie van de ontwerpdefinitie.  
- **Technologie:**  
  - Graphviz voor eenvoudige diagramgeneratie.  

### 5.5 Foutbeheer (Dead Letter Queue)  
- **Functie:** Registreert events die niet succesvol zijn verwerkt en probeert ze opnieuw.  
- **Technologie:**  
  - Kafka DLQ of Redis Queue voor eenvoudige retries.  

---

## 6. Werking van de PoC  

### 6.1 Stap 1: Event Generatie  
1. Een gebruiker spreekt een opdracht in: "Maak een formulier voor feedback."  
2. De Speech Interface converteert dit naar tekst en stuurt een event naar de broker:  
   ```json
   {
       "event_type": "speech_to_text",
       "payload": {
           "text": "Maak een formulier voor feedback",
           "timestamp": "2025-01-07T12:34:56Z"
       }
   }
   ```

### 6.2 Stap 2: Event Verwerking  
1. De NLP-module ontvangt het event en genereert een ontwerpdefinitie:  
   ```json
   {
       "event_type": "nlp_output",
       "payload": {
           "fields": [
               {"name": "Feedback", "type": "textarea"},
               {"name": "Versturen", "type": "button"}
           ]
       }
   }
   ```

### 6.3 Stap 3: Visualisatie  
1. De ontwerpdefinitie wordt doorgestuurd naar de visualisatie-module.  
2. Een eenvoudig diagram wordt gegenereerd, bijvoorbeeld:  
   ```
   +------------+
   |  Feedback  |
   +------------+
   |  Versturen |
   +------------+
   ```

### 6.4 Foutbeheer  
- Bij een fout (bijvoorbeeld NLP-module niet beschikbaar), wordt het event naar de DLQ gestuurd voor herverwerking.  

---

## 7. Planning en Uitvoering  

| **Fase**                | **Activiteit**                              | **Tijd (dagen)** |  
|--------------------------|---------------------------------------------|------------------|  
| 1. Setup                | Opzetten van infrastructuur (Kafka, Flask)  | 2                |  
| 2. Speech-to-Text       | Implementeren van spraakinterface           | 3                |  
| 3. Event Broker         | Configureren van event-broker               | 2                |  
| 4. NLP-module           | Bouwen van NLP-verwerking                  | 3                |  
| 5. Visualisatie         | Ontwikkelen visualisatiecomponent           | 2                |  
| 6. Foutbeheer           | Implementeer DLQ                           | 2                |  
| **Totale Duur:**        | **14 dagen**                                |                  |  

---

## 8. Verwachte Uitkomsten  
1. **Functionele Demonstratie:**  
   - Real-time verwerking van spraakinvoer naar een ontwerpdefinitie.  
   - Visualisatie van het gegenereerde ontwerp.  
2. **EDA Kracht:**  
   - Asynchrone verwerking.  
   - Robuuste foutafhandeling.  
3. **Modulaire Opbouw:**  
   - Eenvoudig uitbreidbaar naar andere modules.  

--- 

## 9. Benodigde Middelen  
1. Ontwikkelomgeving
2. Cloudservices: Optioneel
3. Tijd: 2 weken.  

---

## 10. Conclusie  
Deze PoC biedt een beperkte maar krachtige demonstratie van de Event-Driven Architectuur in het PI6-project. Het legt de basis voor toekomstige uitbreidingen en toont de schaalbaarheid, flexibiliteit en robuustheid van de architectuur.  
