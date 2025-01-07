import pika
import json
from config import RABBITMQ_HOST, RABBITMQ_QUEUE

def process_message(body):
    """
    Verwerkt het bericht dat van RabbitMQ is ontvangen.
    """
    print(f"[x] Bericht ontvangen: {body}")
    try:
        message = json.loads(body)
        print(f"Event Type: {message['event_type']}")
        print(f"Payload: {message['payload']}")
        # Voeg hier verdere verwerking toe (bijvoorbeeld opslaan in een database)
    except json.JSONDecodeError as e:
        print(f"Fout bij decoderen van bericht: {e}")

def main():
    """
    Luistert naar RabbitMQ en verwerkt berichten.
    """
    print("Consumer gestart. Wachten op berichten...")

    # Verbinden met RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
    channel = connection.channel()

    # Zorg ervoor dat de queue bestaat
    channel.queue_declare(queue=RABBITMQ_QUEUE)

    # Callback voor ontvangen berichten
    def callback(ch, method, properties, body):
        process_message(body)

    # Luisteren naar de queue
    channel.basic_consume(
        queue=RABBITMQ_QUEUE,
        on_message_callback=callback,
        auto_ack=True  # Automatisch bevestigen
    )

    # Start luisteren
    print(" [*] Wachten op berichten. Druk op CTRL+C om te stoppen.")
    channel.start_consuming()

if __name__ == "__main__":
    main()