import pika
import json
from config import RABBITMQ_HOST, RABBITMQ_QUEUE
from extract_classes import extract_classes_from_text_with_nlp
from diagram_generator import generate_class_diagram

def process_message(body):
    """
    Verwerkt het bericht dat van RabbitMQ is ontvangen.
    Args:
        body (bytes): Het ontvangen bericht als byte-string.
    """
    print(f"[x] Bericht ontvangen: {body.decode('utf-8')}")
    try:
        # Decodeer JSON-bericht
        message = json.loads(body)
        print(f"Event Type: {message['event_type']}")
        print(f"Payload: {message['payload']}")

        # Verwerk bericht alleen als het om een speech-to-text event gaat
        if message['event_type'] == "speech_to_text":
            text = message['payload']['text']
            # Gebruik NLP om klasseninformatie te extraheren
            classes = extract_classes_from_text_with_nlp(text)
            if classes:
                print(f"Klassen gevonden: {classes}")
                # Genereer een class diagram op basis van de klasseninformatie
                generate_class_diagram(classes)
            else:
                print("Geen klasseninformatie gevonden in de tekst.")
    except json.JSONDecodeError as e:
        print(f"Fout bij decoderen van bericht: {e}")
    except KeyError as e:
        print(f"Ontbrekende sleutel in bericht: {e}")
    except Exception as e:
        print(f"Onverwachte fout: {e}")

def main():
    """
    Luistert naar RabbitMQ en verwerkt berichten.
    """
    print("Consumer gestart. Wachten op berichten...")

    try:
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

        print(" [*] Wachten op berichten. Druk op CTRL+C om te stoppen.")
        channel.start_consuming()
    except pika.exceptions.AMQPConnectionError as e:
        print(f"Kan geen verbinding maken met RabbitMQ: {e}")
    except KeyboardInterrupt:
        print("\nConsumer gestopt.")
    finally:
        try:
            connection.close()
        except Exception:
            pass

if __name__ == "__main__":
    main()