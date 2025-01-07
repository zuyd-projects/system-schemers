FROM python:3.9-slim

# Werkmap instellen op de consumer map binnen system-schemers
WORKDIR /app/consumer

# Vereisten kopiëren en installeren
COPY consumer/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Applicatiecode kopiëren
COPY consumer/src/ ./src

# Start commando instellen
CMD ["python", "./src/consumer.py"]