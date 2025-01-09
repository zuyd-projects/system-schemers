
# Commands for Setting Up and Running the System

This document provides all the necessary commands and steps to set up and run the consumer, producer, RabbitMQ, and the metamodel service.

---

## Python Virtual Environment Commands (for Consumer & Producer)

Virtual environments are used to isolate Python dependencies for the consumer and producer. Below are the commands to manage your virtual environment:

- **Create a new virtual environment:**
  ```bash
  python -m venv venv
  ```
- **Activate the virtual environment:**
  ```bash
  source venv/bin/activate  # On macOS/Linux
  venv\Scripts\activate   # On Windows
  ```
- **Deactivate the virtual environment:**
  ```bash
  deactivate
  ```
- **Install required Python packages:**
  ```bash
  pip install -r requirements.txt
  ```
- **Save installed packages to `requirements.txt`:**
  ```bash
  pip freeze > requirements.txt
  ```

---

## RabbitMQ Setup

RabbitMQ serves as the message broker for communication between the producer and consumer.

### Download and Run RabbitMQ 

Use the following command to download and run RabbitMQ using Docker:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
# NOTE: make sure u add a noa user with password noa to the rabbitmq management interface to be able to use the services

### Start RabbitMQ with Docker Compose (if not already running)

Navigate to the `broker` folder and use Docker Compose to start RabbitMQ:
```bash
docker-compose -f broker/docker-compose.yml up -d
```

---

## Running the Services

After RabbitMQ is running, follow these steps to start the metamodel service, consumer, and producer.

### Start the Consumer (FIRST OTHERWISE QUEUE WILL BE EMPTY)

The consumer listens to RabbitMQ for messages, processes them, and interacts with the metamodel service.

```bash
python services/consumer/src/consumer.py
```
### Start the Metamodel Service

The Metamodel Service handles CRUD operations for managing the metamodel entities.

```bash
cd services/metamodel
node app.js
```
### Start the Crud Generator Service

The Crud Generator Service generates CRUD operations for the metamodel entities.

```bash
cd services/crud-generator
node src/app.js
```

### Start the Producer

The producer records speech, converts it to text, and sends the generated messages to RabbitMQ.

```bash
python services/producer/src/producer.py
```
### Start the speech interface frontend

The frontend is a simple web interface that allows the user to record speech and sent it to consumer.

```bash
cd services/speech-interface/frontend #navigate to the frontend folder
yarn #to install the dependencies
yarn dev #to start the frontend
```
### Start the speech interface frontend backend
The backend does the same as the producer, but uses the front end to record the speech.

```bash
cd services/speech-interface/frontend #navigate to the frontend folder
yarn #to install the dependencies
yarn dev #to start the frontend
```

---

## Notes

1. **Order of Execution:** Ensure RabbitMQ and the Metamodel Service are running before starting the consumer or producer.
2. **Checking RabbitMQ Management UI:**  
   RabbitMQ’s management interface can be accessed at [http://localhost:15672](http://localhost:15672).  
   - Default username: `guest`  
   - Default password: `guest`
3. **Debugging:** Logs from each service will provide information about the execution process and any issues encountered.

---

By following these commands, you will have a fully functional environment to test and use the consumer, producer, and metamodel service.


## Contributors
- **Noa Heutz** - Architect and Developer
- **Maikel Heijen** - Architect and Developer