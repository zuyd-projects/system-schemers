
# Proof of Concept (PoC): Event-Driven Architecture (EDA) for PI6

**Version:** 2.0  
**Author:** Noa Heutz  
**Date:** Thu 9 Jan  

---

## 1. Introduction  
This document describes a Proof of Concept (PoC) for a specific part of the PI6 project, focusing on the implementation and demonstration of an Event-Driven Architecture (EDA). The selected component is the **Speech-to-Text and Design Definition Module**, which serves as a core element in the PI6 project.  
The PoC has been extended with a **Metamodel Service**, which utilizes a relational database to manage structured data such as classes, attributes, and relationships.

---

## 2. Objectives  
- **Demonstrate EDA principles:** Real-time processing of speech-based commands into a design definition.  
- **Integrate a Metamodel Service:** Use a database to store and retrieve design data.  
- **Show scalability:** Demonstrate efficient asynchronous processing of multiple commands.  
- **Implement error handling:** Use a Dead Letter Queue (DLQ) to capture and retry failed events.  
- **Provide output to other modules:** Generate an event stream usable by other components (e.g., visualization).  

---

## 3. Scope of the PoC  
The PoC focuses on the following components:  
1. **Speech Interface (Producer):** Processes speech input and generates an event.  
2. **NLP Module (Consumer):** Converts speech events into a JSON-based design definition.  
3. **Event Broker:** Distributes events between modules.  
4. **Metamodel Service:** Manages and stores design data in a relational database.  
5. **Visualization:** Displays the design definition as a diagram based on data from the Metamodel Service.  
6. **Error Handling:** Uses a Dead Letter Queue to retry failed events.  

---

## 4. Architecture Overview  
**Architecture Diagram:**  

```plaintext
                 +-----------------------------------------+
                 |             Dead Letter Queue           |
                 |       (Captures errors at any stage)    |
                 +-----------------------------------------+
                               ^
                               |
+---------------+          +---------------+          +---------------+
| Speech Input  |  ---->   | Event Broker  |  ---->   | NLP Module    |
| (Producer)    |          | (RabbitMQ)    |          | (Consumer)    |
+---------------+          +---------------+          +---------------+
                                                           |
                                                           v
                          +-------------------+
                          |   Metamodel       |
                          |   Service (DB)    |
                          +-------------------+
                                |
                                v
                      +-----------------------+
                      |    Visualization      |
                      |     (Graphviz)        |
                      +-----------------------+
```

---

## 5. Technical Details  

### 5.1 Speech Interface (Producer)  
- **Function:** Captures user speech input and converts it into text.  
- **Event:** JSON payload containing the speech text and metadata (e.g., timestamp).  
- **Technology:**  
  - Speech-to-Text API: OpenAI Whisper.  
  - Language: Python.  

### 5.2 Event Broker  
- **Function:** Distributes events between modules.  
- **Technology:**  
  - RabbitMQ for simple and asynchronous processing.  

### 5.3 NLP Module (Consumer)  
- **Function:** Processes text into a design definition.  
- **Event:** JSON payload containing the design definition (e.g., fields, buttons).  
- **Technology:**  
  - NLP Tool: GPT-4 API.  
  - Design Model: JSON output describing fields (e.g., name, type).  

### 5.4 Metamodel Service  
- **Function:** Manages and stores design data (e.g., ObjectTypes, FactTypes, Attributes) in a relational database.  
- **Endpoints:**  
  - **POST /model:** Add new object types, attributes, and relationships.  
  - **GET /model:** Retrieve data for visualization.  
- **Technology:**  
  - Database: SQLite or MS SQL Server.  
  - Framework: Express.js (JavaScript).  

### 5.5 Visualization Module  
- **Function:** Generates a visual representation of the design definition based on data from the Metamodel Service.  
- **Technology:**  
  - Graphviz for diagram generation.  

### 5.6 Error Handling (Dead Letter Queue)  
- **Function:** Captures events that fail to process and retries them.  
- **Technology:**  
  - RabbitMQ Dead Letter Exchange.  

---

## 6. PoC Workflow  

### 6.1 Step 1: Event Generation  
1. A user speaks a command: "Create a feedback form."  
2. The Speech Interface converts the speech into text and sends an event to the broker:  
   ```json
   {
       "event_type": "speech_to_text",
       "payload": {
           "text": "Create a feedback form",
           "timestamp": "2025-01-09T14:00:00Z"
       }
   }
   ```

### 6.2 Step 2: Event Processing  
1. The NLP Module receives the event and generates a design definition:  
   ```json
   {
       "event_type": "nlp_output",
       "payload": {
           "object_types": [
               {
                   "name": "FeedbackForm",
                   "attributes": [
                       {"name": "Feedback", "datatype": "text"},
                       {"name": "Submit", "datatype": "button"}
                   ]
               }
           ]
       }
   }
   ```

2. The NLP Module sends this to the Metamodel Service via an API call or event.  

### 6.3 Step 3: Data Storage in the Metamodel Service  
1. The Metamodel Service stores the data in the database (e.g., `ObjectType`, `Attribute` tables).  

### 6.4 Step 4: Visualization  
1. The Visualization Module retrieves data via the Metamodel Service.  
2. A diagram is generated and saved as a PNG file.  

### 6.7 Error Handling  
- If an error occurs (e.g., a missing database connection), the event is sent to the DLQ for retry processing.  

---

## 7. Planning and Execution  

| **Phase**               | **Activity**                              | **Time (days)** |  
|--------------------------|-------------------------------------------|-----------------|  
| 1. Setup                | Set up infrastructure (RabbitMQ)          | 2               |  
| 2. Speech-to-Text       | Implement speech interface                | 3               |  
| 3. Event Broker         | Configure event broker                    | 2               |  
| 4. NLP Module           | Build NLP processing                      | 3               |  
| 5. Metamodel Service    | Implement API and database                | 3               |  
| 6. Visualization        | Develop visualization component           | 2               |  
| 7. Error Handling       | Implement DLQ                             | 2               |  
| **Total Duration:**     | **17 days**                               |                 |  

---

## 8. Expected Outcomes  
1. **Functional Demonstration:**  
   - Real-time processing of speech input into a design definition.  
   - Visualization of the generated design.  
2. **EDA Strengths:**  
   - Asynchronous processing.  
   - Robust error handling.  
3. **Metamodel Service:**  
   - Flexible storage and management of design data.  
4. **Modular Structure:**  
   - Easily extendable to other modules.  

---

## 9. Required Resources  
1. Development environment.  
2. Cloud services: Optional.  
3. Time: 2-3 weeks.  

---

## 10. Conclusion  
This PoC provides a robust demonstration of the Event-Driven Architecture, extended with a Metamodel Service. It showcases the scalability, flexibility, and robustness of the architecture, laying a foundation for future extensions....
