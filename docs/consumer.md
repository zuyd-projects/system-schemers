
# Consumer Documentation

The **Consumer** is responsible for receiving and processing messages from RabbitMQ and generating class diagrams based on the received text.

## Overview
1. **Message Retrieval:**  
   The consumer listens to a RabbitMQ queue and retrieves messages as they become available.
2. **Text Processing with OpenAI NLP:**  
   The received text is analyzed using the OpenAI API to extract class information.
3. **Class Diagram Generation:**  
   Using Graphviz, a class diagram is generated and saved.

---

## Configuration
The configuration for the consumer is defined in `config.py`:
```python
# RabbitMQ configuration
RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'speech_events'

# OpenAI API key
OPENAI_API_KEY = 'your-api-key-here'

METAMODEL_SERVICE_URL = "http://localhost:5005/api"
```

---

## File Structure
The consumer consists of the following modules:

```plaintext
consumer/
├── src/
│   ├── consumer.py               # Main script of the consumer
│   ├── extract_classes.py        # Analyzes text using OpenAI API
│   ├── diagram_generator.py      # Generates class diagrams
│   ├── metamodel_service.py      # Interacts with the metamodel service
│   ├── config.py                 # Configuration file
├── tests/                        # Unit tests for the consumer
├── requirements.txt              # Required Python packages
└── Dockerfile                    # Docker configuration
```

---

## Usage
1. **Start RabbitMQ:**
   Ensure RabbitMQ is running. You can use Docker Compose:
   ```bash
   docker-compose -f broker/docker-compose.yml up -d
   ```

2. **Start the producer:**
   Ensure the producer sends messages to RabbitMQ, such as:
   ```plaintext
   "Create a form with fields name, email, and comments."
   ```

3. **Start the consumer:**
   Run the script:
   ```bash
   python consumer/src/consumer.py
   ```

4. **Result:**
   - The generated class diagram will be saved as a PNG file in `diagram_output/class_diagram.png`.
   - Extracted classes will be stored in the Metamodel Service.

---

## Key Functions

### **`consumer.py`**
- **`process_message(body)`:**
  Processes each message received from RabbitMQ. This includes:
  - Decoding JSON messages.
  - Calling `extract_classes_from_text_with_nlp` for text analysis.
  - Sending extracted classes to the metamodel service via `send_to_metamodel_service`.
  - Optionally calling `generate_class_diagram` to generate a class diagram.

- **`main()`:**
  Connects to RabbitMQ, listens to the queue, and calls `process_message` for each received message.

---

### **`extract_classes.py`**
- **`extract_classes_from_text_with_nlp(text)`:**
  - Analyzes the text using the OpenAI API (GPT model).
  - Returns a list of classes, including fields, methods, and relationships.

---

### **`diagram_generator.py`**
- **`generate_class_diagram(classes, output_path)`:**
  - Generates a class diagram in PNG format.
  - Supports classes, fields, methods, and relationships.

---

### **`metamodel_service.py`**
- **`send_to_metamodel_service(classes, model_id)`:**
  - Sends extracted class information to the Metamodel Service via REST API.
  - Creates models, object types, attributes, and relationships in the service.

---

## Requirements
Ensure the following packages are installed:
```bash
pip install pika openai graphviz requests
```

---

## Testing
1. **Producer:**
   - Send a message such as:  
     ```plaintext
     "Create a form with fields name, email, and comments."
     ```

2. **Consumer:**
   - Check the console output to see if the text is correctly analyzed and if the diagram is generated.

3. **Diagram Output:**
   - Open the generated diagram in `diagram_output/class_diagram.png`.

4. **Metamodel Service Integration:**
   - Verify the classes, attributes, and relationships are stored in the Metamodel Service.

---

## Possible Extensions
1. **More Complex NLP Processing:**
   - Add additional prompts to better understand relationships and class logic.
2. **UI Integration:**
   - Display the generated diagrams through a frontend.
3. **Database Support:**
   - Store class information in a database for further analysis.
4. **Error Handling and Retry Logic:**
   - Improve error handling when interacting with RabbitMQ or the Metamodel Service.

---

Let us know if you have further questions or need assistance!
