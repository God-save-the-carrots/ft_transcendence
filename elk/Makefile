COMPOSE = docker compose -f elk.yaml

up:
	mkdir -p elasticsearch kibana
	$(COMPOSE) up -d

down:
	$(COMPOSE) down --volumes

prune:
	$(COMPOSE) down --volumes
	docker system prune --all
	find certs \! -name instances.yml -delete
	rm -rf elasticsearch kibana

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs ${service} -f
