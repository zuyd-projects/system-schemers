
# CRUD Generator Service Documentation

The **CRUD Generator Service** dynamically generates backend CRUD applications based on a metamodel definition retrieved from a central service. It listens for events or accepts HTTP requests to generate and save files in a structured format.

---

## Features

- **Dynamic CRUD Generation**: Automatically generate models, database schemas, and API routes for any object type.
- **RabbitMQ Integration**: Listens to `app_ready_to_generate` events to trigger CRUD generation.
- **REST API Support**: Provides an HTTP endpoint for manual CRUD generation requests.
- **Output Directory Management**: Saves generated files in a directory structure based on `modelId`.

---

## Architecture

### 1. Event-Driven
The service listens to a RabbitMQ queue (`speech_events`) for messages with the event type `app_ready_to_generate`.

### 2. HTTP Endpoint
Provides an API endpoint (`/generate`) for manual CRUD generation.

### 3. Output Directory
Generated CRUD files are saved in `src/output/model_<modelId>/`.

---

## Usage

### 1. Environment Setup
Ensure the following tools and dependencies are available:
- **Node.js**: Installed on your system.
- **RabbitMQ**: Running and accessible at `amqp://localhost:5672`.
- **Dependencies**: Install required packages using:
  ```bash
  yarn install
  ```

### 2. Starting the Service
Start the service using:
```bash
node src/app.js
```

The service will:
- Start an HTTP server at `http://localhost:5007`.
- Connect to RabbitMQ and listen for events.

---

## API Endpoints

### **POST /generate**
Trigger CRUD generation manually.

#### Request:
```json
{
    "modelId": 1
}
```

#### Response:
```json
{
    "message": "CRUD application generated",
    "output": "./src/output/model_1"
}
```

---

## RabbitMQ Integration

### Queue Name:
- `speech_events`

### Expected Message Format:
```json
{
    "event_type": "app_ready_to_generate",
    "payload": {
        "model_id": 1
    }
}
```

When the service receives this message, it:
1. Fetches the object type definitions and attributes for `model_id` from the Metamodel Service.
2. Generates the CRUD files in the `src/output/model_<modelId>/` directory.

---

## Directory Structure
Generated files are saved in the following structure:
```
src/output/
├── model_<modelId>/
│   ├── <ObjectType>.sql        # Database schema
│   ├── <ObjectType>.model.js   # ORM model
│   ├── <ObjectType>.routes.js  # API routes
```

---

## Configuration

### RabbitMQ Configuration:
Update RabbitMQ settings in `app.js`:
```javascript
const RABBITMQ_HOST = "amqp://localhost:5672";
const RABBITMQ_QUEUE = "speech_events";
```

### Output Directory:
Files are generated in `src/output/model_<modelId>`.

---

## Error Handling

### RabbitMQ Errors:
If the service cannot connect to RabbitMQ:
- It logs an error and retries every 5 seconds.

### CRUD Generation Errors:
If a model cannot be generated, the error is logged, and the process continues for other models.

---

## Testing

1. **Send RabbitMQ Event**:
   Publish an `app_ready_to_generate` message to the `speech_events` queue.

2. **Call API Endpoint**:
   Use `curl` or Postman to call the `/generate` endpoint:
   ```bash
   curl -X POST http://localhost:5007/generate    -H "Content-Type: application/json"    -d '{"modelId": 1}'
   ```

3. **Verify Output**:
   Check `src/output/model_<modelId>` for the generated files.

---

## Future Enhancements

1. **Frontend Integration**:
   Add UI to view and manage generated CRUD applications.

2. **Customizable Output**:
   Allow users to specify file formats or templates.

3. **Additional Event Types**:
   Extend support for more event types to handle varied use cases.

---

## Troubleshooting

### Common Issues:
- **Queue Error**: Ensure the `speech_events` queue exists and is correctly configured.
- **File Permission Error**: Verify write permissions for the `src/output` directory.

### Logs:
Check logs for errors or status messages:
- CRUD Generator Service: Console logs.
- RabbitMQ: Management UI or CLI.

---

## Contributors
- **Noa Heutz** - Architect and Developer
- **Maikel Heijen** - Architect and Developer