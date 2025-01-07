FROM python:3.9-slim

# Werkmap instellen op de producer map binnen system-schemers
WORKDIR /app/producer

# Vereisten kopiëren en installeren
COPY producer/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Applicatiecode kopiëren
COPY producer/src/ ./src

# Start commando instellen
CMD ["python", "./src/producer.py"]