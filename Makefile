# Start alle services
run:
	docker-compose -f broker/docker-compose.yml up -d
	python producer/src/producer.py &
	python consumer/src/consumer.py &

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