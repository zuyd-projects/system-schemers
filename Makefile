#FIXME: Start all services
run:
	@echo "Starting RabbitMQ broker..."
	docker-compose -f services/broker/docker-compose.yml up -d
	@echo "Waiting for RabbitMQ to be ready..."
	sleep 10  # Adjust time if needed

	@echo "Starting Metamodel Service..."
	cd services/metamodel && node app.js &

	@echo "Starting CRUD Generator Service..."
	cd services/crud-generator && node src/app.js &

	@echo "Starting Consumer..."
	python services/consumer/src/consumer.py &

	@echo "Starting Producer..."
	python services/producer/src/producer.py &

	@echo "Starting the Speech Interface frontend..."
	cd services/speech-interface/frontend && yarn && yarn dev &

	@echo "All services are starting in the background."

# Stop all services
stop:
	# @echo "Stopping RabbitMQ broker..."
	# docker-compose -f broker/docker-compose.yml down
	@echo "Killing Python processes..."
	- killall python || true
	@echo "Killing Node processes..."
	- killall node || true
	@echo "All services stopped."