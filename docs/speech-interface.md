# Speech Interface Backend Documentation

The **Speech Interface Backend** is responsible for receiving transcription data from the frontend, processing it, and publishing it to RabbitMQ for further use by other components in the system.

## Overview
1.	**Transcription Handling:** The backend provides an API endpoint to receive transcription data from the frontend. It validates the received transcription text before processing.
2. **Message Publishing:**
Transcription data is structured into an event object and published to the RabbitMQ queue speech_events.

## Configuration

The configuration for the backend is defined directly in the script:

`const PORT = 5008;` // Backend server port
`const RABBITMQ_URL = "amqp://localhost";` // RabbitMQ connection URL
`const QUEUE_NAME = "speech_events";` // RabbitMQ queue name

Ensure RabbitMQ is running locally at amqp://localhost.

## File Structure

The backend consists of the following file:

backend/
├── index.js               # Main script for the backend server

Usage
1.	**Start RabbitMQ:** Ensure RabbitMQ is running. You can start RabbitMQ with Docker Compose:

docker-compose -f broker/docker-compose.yml up -d

2.	**Start the Backend Server:** Navigate to the backend folder, install dependencies, and start the server:

`cd backend`
`npm install`
`node index.js`

**The server will be available at http://localhost:5008.**

3.	**Send Transcriptions to the Backend:** Use a tool like Postman, curl, or the frontend to send a POST request to /api/send-transcription.

## Example payload:

{
  "text": "This is a sample transcription."
}


4.	**Result:** The transcription data is processed and published to the RabbitMQ speech_events queue.

## Key Functions

API Endpoint: /api/send-transcription
- **Purpose:** Receives transcription text from the frontend, validates it, and publishes it to RabbitMQ.
- **Input:** A JSON object containing the transcription text:

{
  "text": "Sample transcription text."
}

- **Response:** On success:

{
  "message": "Transcription received and sent to RabbitMQ",
  "event": {
    "event_type": "speech_to_text",
    "payload": {
      "text": "Sample transcription text."
    }
  }
}

- **Error Handling:** If the text field is missing or invalid:

{
  "error": "No transcription text provided"
}

## sendToRabbitMQ(message)
- **Purpose:** Sends the event object to the RabbitMQ queue speech_events.
- **Implementation:**

async function sendToRabbitMQ(message) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("speech_events", { durable: false });
  channel.sendToQueue("speech_events", Buffer.from(JSON.stringify(message)));

  console.log("[x] Sent:", message);
  await channel.close();
  await connection.close();
}

- **Example Message:**

{
  "event_type": "speech_to_text",
  "payload": {
    "text": "Sample transcription text."
  }
}

Example Workflow

	1.	Frontend Interaction:
The frontend sends transcription text to the /api/send-transcription endpoint.
	2.	Backend Processing:
	•	Validates the input.
	•	Creates an event object containing the transcription.
	•	Publishes the event to RabbitMQ.
	3.	RabbitMQ Queue:
The event is available in the speech_events queue for further processing by consumers.

## Requirements

Install the following dependencies for the backend:

npm install express body-parser amqplib

## Testing
1.	**Test the API Endpoint:** Use Postman, curl, or similar tools to send a request to the backend:

curl -X POST http://localhost:5008/api/send-transcription \
-H "Content-Type: application/json" \
-d '{"text": "This is a test transcription."}'

Expected response:

{
  "message": "Transcription received and sent to RabbitMQ",
  "event": {
    "event_type": "speech_to_text",
    "payload": {
      "text": "This is a test transcription."
    }
  }
}

2.	**Verify RabbitMQ Queue:** Use RabbitMQ’s management UI or a simple consumer script to ensure the message is published to the speech_events queue.

3.	**Test Error Handling:** Send invalid or empty requests to ensure proper error responses:

curl -X POST http://localhost:5008/api/send-transcription \
-H "Content-Type: application/json" \
-d '{}'

Expected response:

{
  "error": "No transcription text provided"
}

## Possible Extensions
	1.	Authentication:
## Protect the API endpoint using JWT or another authentication method.
	2.	Improved Error Handling:
## Add detailed error messages and logging using a library like winston.
	3.	Durable Queues:
## Make the RabbitMQ queue durable to persist messages in case of server restarts.
	4.	Scalability:
## Deploy the backend as a containerized microservice using Docker for better scalability.
	5.	Integration with Frontend:
## Extend the frontend to show status updates or confirmations when the transcription is successfully sent to the backend.

## Contributors
- **Noa Heutz** - Architect and Developer
- **Maikel Heijen** - Architect and Developer