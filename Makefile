.PHONY: up down restart rebuild logs

up:
	docker-compose up -d

down:
	docker-compose down

restart: down up

rebuild:
	docker-compose down
	docker-compose build
	docker-compose up -d

logs:
	docker-compose logs -f