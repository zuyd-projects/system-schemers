# Start all services
run:
	docker-compose -f broker/docker-compose.yml up -d
	@echo "Waiting for RabbitMQ to be ready..."
	sleep 10  # Wait for RabbitMQ (or adjust the time as needed)
	python consumer/src/consumer.py &
	python producer/src/producer.py &

# Stop alle services
stop:
	docker-compose -f broker/docker-compose.yml down
	killall python

# Testen
test:
	pytest producer/tests/
	pytest consumer/tests/
	pytest tests/e2e_tests/

# Bouw Docker-images
build:
	docker build -t producer ./producer
	docker build -t consumer ./consumer