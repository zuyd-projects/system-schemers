import pika
import json
import time
from config import RABBITMQ_HOST, RABBITMQ_QUEUE, RABBITMQ_NAME, RABBITMQ_PASSWORD
from extract_classes import extract_classes_from_text_with_nlp
from diagram_generator import generate_class_diagram
from metamodel_service import create_model, send_to_metamodel_service

def process_message(body):
    """
    Process the message received from RabbitMQ.
    Args:
        body (bytes): The received message as a byte string.
    """
    print(f"[x] Message received: {body.decode('utf-8')}")
    try:
        # Decode JSON message
        message = json.loads(body)
        print(f"Event Type: {message['event_type']}")
        print(f"Payload: {message['payload']}")

        # Process message only if it's a speech-to-text event
        if message['event_type'] == "speech_to_text":
            text = message['payload']['text']
            # Use NLP to extract class information
            classes = extract_classes_from_text_with_nlp(text)
            if classes:
                print(f"Classes found: {classes}")

                # Create a new model in the Metamodel Service
                model_id = create_model()
                if model_id:
                    # Send classes and relationships to Metamodel Service
                    send_to_metamodel_service(classes, model_id)
                    # Optionally, generate a class diagram
                    generate_class_diagram(classes) #FIXME: THIS SHOULD BE ANOTHER SERVICE FAVORABLY AFTER THE METAMODEL SERVICE
            else:
                print("No class information found in the text.")
    except json.JSONDecodeError as e:
        print(f"Error decoding message: {e}")
    except KeyError as e:
        print(f"Missing key in message: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

def main():
    """
    Listen to RabbitMQ and process messages.
    """
    print("Consumer started. Waiting for messages...")

    def connect_and_consume():
        """
        Try to connect to RabbitMQ and consume messages.
        """
        connection = None
        while True:
            try:
                # Connect to RabbitMQ
                connection = pika.BlockingConnection(pika.ConnectionParameters(
                    host=RABBITMQ_HOST,
                    credentials=pika.PlainCredentials(RABBITMQ_NAME, RABBITMQ_PASSWORD)
                ))
                channel = connection.channel()

                # Ensure the queue exists
                channel.queue_declare(queue=RABBITMQ_QUEUE)

                # Callback for received messages
                def callback(ch, method, properties, body):
                    process_message(body)

                # Listen to the queue
                channel.basic_consume(
                    queue=RABBITMQ_QUEUE,
                    on_message_callback=callback,
                    auto_ack=True  # Automatically acknowledge messages
                )

                print(" [*] Waiting for messages. Press CTRL+C to exit.")
                channel.start_consuming()

            except pika.exceptions.AMQPConnectionError as e:
                print(f"Cannot connect to RabbitMQ: {e}")
                print("Reconnecting in 5 seconds...")
                time.sleep(5)  # Wait before retrying
            except KeyboardInterrupt:
                print("\nConsumer stopped by user.")
                break
            except Exception as e:
                print(f"Unexpected error: {e}")
                break
            finally:
                if connection and connection.is_open:
                    connection.close()

    connect_and_consume()

if __name__ == "__main__":
    main()