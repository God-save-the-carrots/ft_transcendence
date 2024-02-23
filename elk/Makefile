COMPOSE = docker compose -f elk.yaml

up:
	mkdir -p certs elasticsearch kibana logstash/data
	$(COMPOSE) up -d

down:
	$(COMPOSE) down --volumes

prune:
	$(COMPOSE) down --volumes
	docker system prune --volumes
	sudo rm -rf certs elasticsearch kibana logstash/data

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs ${service} -f
