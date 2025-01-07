### Python Virtual Environment Commands

- `python -m venv venv` - Maak een nieuwe virtual environment.
- `source venv/bin/activate` - Activeer de virtual environment.
- `deactivate` - Deactiveer de virtual environment.
- `pip install -r requirements.txt` - Installeer vereiste Python-pakketten.
- `pip freeze > requirements.txt` - Sla huidige pakketten op in `requirements.txt`.

### Start de Producer

```bash
python producer/src/producer.py
```

### Start de Consumer

```bash
python consumer/src/consumer.py
```

### Download RabbitMQ

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### Start RabbitMQ met Docker Compose

````bash
docker-compose -f broker/docker-compose.yml up -d
```d
````
