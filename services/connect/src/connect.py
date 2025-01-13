import pika
import time

# Stel gebruikersnaam en wachtwoord in
username = 'noa'  # Vervang door je RabbitMQ-gebruikersnaam
password = 'noa'  # Vervang door je RabbitMQ-wachtwoord

# Maak RabbitMQ-credentials aan
credentials = pika.PlainCredentials(username, password)

while True:
    try:
        # Maak een verbinding met RabbitMQ met authenticatie
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host='rabbitmq',  # Vervang door de RabbitMQ-host
                credentials=credentials
            )
        )
        print("Connection successful!")
        connection.close()
        break  # Verlaat de lus als de verbinding succesvol is
    except pika.exceptions.AMQPConnectionError as e:
        print(f"Connection failed: {e}. Retrying in 5 seconds...")
        time.sleep(5)  # Wacht 5 seconden voordat je opnieuw probeert