COMPOSE = docker compose -f elk.yaml

up:
	mkdir -p elasticsearch
	$(COMPOSE) up -d

down:
	$(COMPOSE) down --volumes

prune:
	$(COMPOSE) down --rmi all --volumes
	docker system prune --all
	find certs \! -name instances.yml -delete
	rm -rf elasticsearch

logs:
	$(COMPOSE) logs ${service} -f
