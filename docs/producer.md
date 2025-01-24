
# Producer Documentation
<!-- DEPRECATED: THIS WAS AN EXAMPLE VERSION WE NOW USE THE SPEECH INTERFACE -->
The **Producer** is responsible for recording speech, converting it to text using the OpenAI Whisper API, and sending the generated messages to RabbitMQ.

## Overview
1. **Speech-to-Text:** The producer uses the OpenAI Whisper API to convert speech into text.
2. **Event Generation:** The result is packaged into a JSON event.
3. **Message Sending:** The event is published to a specific RabbitMQ queue.

## Configuration
The configuration for the producer is set in `config.py`:
```python
# RabbitMQ configuration
RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'speech_events'

# OpenAI API key
OPENAI_API_KEY = 'your-api-key-here'
```

### Requirements
- **Python Packages:**
  Ensure the following packages are installed:
  ```bash
  pip install pika openai
  ```
- **RabbitMQ:**  
  Ensure a RabbitMQ server is running.

## How to Use
1. **Start RabbitMQ:**
   Use Docker Compose to start RabbitMQ:
   ```bash
   docker-compose -f broker/docker-compose.yml up -d
   ```

2. **Prepare an Audio File:**
   Place an audio file named `input_audio.wav` in the folder `producer/audio/`.

3. **Start the Producer:**
   Run the script:
   ```bash
   python producer/src/producer.py
   ```

4. **Expected Output:**
   - The script reads the audio file, converts it to text, and sends a message to RabbitMQ:
     ```plaintext
     Producer started. Processing speech input...
     Speak your command...
     Recognition completed: I would like a form with the fields email, name, and additional comments.
     [x] Message sent: {"event_type": "speech_to_text", "payload": {"text": "I would like a form with the fields email, name, and additional comments."}}
     ```

## Key Functions
- **`transcribe_speech`:**  
  Converts speech to text using the OpenAI Whisper API.
- **`send_to_broker`:**  
  Sends the generated message to RabbitMQ.

## Error Handling
- If the audio file is not found:
  ```plaintext
  Audio file not found: ../audio/input_audio.wav
  ```
- If the connection to RabbitMQ fails:
  Ensure RabbitMQ is running and the configuration is correct.

## Next Steps
- Integrate with a frontend to dynamically start speech recording.
- Add automatic retries for RabbitMQ connections.

## Contributors
- **Noa Heutz** - Architect and Developer
- **Maikel Heijen** - Architect and Developer