.DELETE_ON_ERROR:
.DEFAULT_GOAL	:= help

ifeq ($(wildcard .env),)
$(error .env not found)
endif
include .env

COMPOSE = \
	docker compose \
	-p ft_transcendence \
	-f compose-dev.yaml \
	-f elk/elk.yaml \

# **************************************************************************** #
# custom rules
# **************************************************************************** #

.PHONY: help # Generate list of targets with descriptions
help:
	@echo
	@echo "\033[0;33mUsage\033[0m: make [target]"
	@echo
	@echo "targets:"
	@grep -e '^.PHONY: .*#' -e '^#=' Makefile | sed -E -e 's|#=(.*)|\n\1:|' -e 's|\.PHONY: (.*) # (.*)|  [0;36m \1 [0m	\2|' | expand -t30

.PHONY: guide # Generate guide
guide:
	@echo "\033[0;33mdefault: \033[0m"
	@echo make up
	@echo make ls networks volumes images ps top logs
	@echo make exec servcie=example
	@echo make down
	@echo make prune
	@echo
	@echo "\033[0;33mfor debug: \033[0m"
	@echo COMPOSE_PROFILES=debug make up
	@echo COMPOSE_PROFILES=debug make down
	@echo
	@echo "\033[0;33mfor compose: \033[0m"
	@echo make ls networks volumes images
	@echo make config
	@echo
	@echo "\033[0;33mfor image: \033[0m"
	@echo 'make build'
	@echo 'docker images'
	@echo 'docker images -q | xargs docker image rm'
	@echo
	@echo "\033[0;33mfor container: \033[0m"
	@echo make create start
	@echo make ps top logs
	@echo make stop rm

.PHONY: prune # Remove unused data
prune:
	docker system prune --all

.PHONY: version # Show the Docker Compose version information
version:
	${COMPOSE} version

.PHONY: config # Converts the compose file to platform's canonical form
config:
	${COMPOSE} config

# **************************************************************************** #
# for network, volume, image
# **************************************************************************** #

.PHONY: networks # List networks
networks:
	docker network ls
	@echo
	@echo 'For more detail, run: docker network inspect ${network}'

.PHONY: volumes # List volumes
volumes:
	docker volume ls
	@echo
	@echo 'For more detail, run: docker volume inspect ${volume}'

.PHONY: images # List images used by the created containers
images:
	${COMPOSE} images
	@echo
	@echo For more detail, run: docker image inspect ${image}

.PHONY: build # Build or rebuild services
build:
	${COMPOSE} build

.PHONY: pull # Pull service images
pull:
	${COMPOSE} pull ${service}

.PHONY: push # Push service images
push:
	${COMPOSE} push ${service}

# **************************************************************************** #
# for monitoring
# **************************************************************************** #

.PHONY: ls # List compose projects
ls:
	${COMPOSE} ls --all

.PHONY: ps # List containers
ps:
	${COMPOSE} ps --all

.PHONY: top # Display the running processes
top:
	${COMPOSE} top

.PHONY: events # Receive real time events from containers.
events:
	${COMPOSE} events

# **************************************************************************** #
# for container
# **************************************************************************** #

.PHONY: create # Creates containers for a service.
create:
	@mkdir -p ${DATABASE_VOLUME} ./elk/certs ./elk/elasticsearch ./elk/kibana ./elk/logstash/data
	${COMPOSE} create --build

.PHONY: up # Create and start containers
up:
	@mkdir -p ${DATABASE_VOLUME} ./elk/certs ./elk/elasticsearch ./elk/kibana ./elk/logstash/data
	@./create_certificate.sh
	${COMPOSE} up -d --build

.PHONY: down # Stop and remove containers, networks
down:
	${COMPOSE} down --volumes

.PHONY: rm # Removes stopped service containers
rm:
	${COMPOSE} rm --volumes ${servcie}

# **************************************************************************** #
# for process
# **************************************************************************** #

.PHONY: logs # View output from containers
logs:
	${COMPOSE} logs ${service} -f

.PHONY: stop # Stop services
stop:
	${COMPOSE} stop ${service}

.PHONY: start # Start services
start:
	${COMPOSE} start ${service}

.PHONY: restart # Restart service containers
restart:
	${COMPOSE} restart ${service}

.PHONY: pause # Pause services
pause:
	${COMPOSE} pause ${service}

.PHONY: unpause # Unpause services
unpause:
	${COMPOSE} unpause ${service}

.PHONY: kill # Force stop service containers.
kill:
	${COMPOSE} kill ${service}

# **************************************************************************** #
# for service
# **************************************************************************** #

.PHONY: port # Print the public port for a port binding.
port:
	${COMPOSE} port --help

.PHONY: cp # Copy files/folders between a service container and the local filesystem
cp:
	${COMPOSE} cp --help

.PHONY: run # Run a one-off command on a service.
run:
	@[ -z "$(service)" ] && { echo "Usage: make run service=example"; exit 1; } || true
	$(eval command := $(or $(command),/bin/sh))
	${COMPOSE} run ${options} ${service} ${command} ${args}

.PHONY: exec # Execute a command in a running container.
exec:
	@[ -z "$(service)" ] && { echo "Usage: make exec service=example"; exit 1; } || true
	$(eval command := $(or $(command),/bin/sh))
	${COMPOSE} exec ${options} ${service} ${command} ${args}
