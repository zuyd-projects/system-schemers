import pika
import json
from speech_to_text import transcribe_speech
from config import RABBITMQ_HOST, RABBITMQ_QUEUE

def send_to_broker(message):
    """
    Verzendt een bericht naar de RabbitMQ-broker.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE)

    # Verstuur bericht
    channel.basic_publish(exchange='', routing_key=RABBITMQ_QUEUE, body=json.dumps(message))
    print(f"[x] Bericht verstuurd: {message}")

    connection.close()

def main():
    """
    Voert spraakinvoer één keer uit en sluit daarna af.
    """
    print("Producer gestart. Spraakinvoer verwerken...")

    # Haal spraakinvoer op en converteer naar tekst
    text = transcribe_speech()  # Functie uit speech_to_text.py
    if text:
        # Creëer event
        event = {
            "event_type": "speech_to_text",
            "payload": {
                "text": text
            }
        }
        # Stuur event naar broker
        send_to_broker(event)
    else:
        print("Geen tekst ontvangen, producer stopt.")

if __name__ == "__main__":
    main()