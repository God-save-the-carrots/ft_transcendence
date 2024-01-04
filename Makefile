.DELETE_ON_ERROR:
.DEFAULT_GOAL	:= help

ifeq ($(wildcard srcs/.env),)
$(error srcs/.env not found)
endif
include srcs/.env

# **************************************************************************** #
# pre-defined environment in docker-compose
# **************************************************************************** #

COMPOSE_PROJECT_NAME	:= ft_transcendence
COMPOSE_FILE			:= srcs/compose.yaml
COMPOSE_PROFILES		:=

export COMPOSE_PROJECT_NAME COMPOSE_FILE COMPOSE_PROFILES

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
	docker compose version

.PHONY: config # Converts the compose file to platform's canonical form
config:
	docker compose config

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
	docker compose images
	@echo
	@echo For more detail, run: docker image inspect ${image}

.PHONY: build # Build or rebuild services
build:
	docker compose build

.PHONY: pull # Pull service images
pull:
	docker compose pull ${service}

.PHONY: push # Push service images
push:
	docker compose push ${service}

# **************************************************************************** #
# for monitoring
# **************************************************************************** #

.PHONY: ls # List compose projects
ls:
	docker compose ls --all

.PHONY: ps # List containers
ps:
	docker compose ps --all

.PHONY: top # Display the running processes
top:
	docker compose top

.PHONY: events # Receive real time events from containers.
events:
	docker compose events

# **************************************************************************** #
# for container
# **************************************************************************** #

.PHONY: create # Creates containers for a service.
create:
	@mkdir -p ${DATABASE_VOLUME}
	docker compose create --build

.PHONY: up # Create and start containers
up:
	@mkdir -p ${DATABASE_VOLUME}
	docker compose up -d --build

.PHONY: down # Stop and remove containers, networks
down:
	docker compose down --rmi all --volumes

.PHONY: rm # Removes stopped service containers
rm:
	docker compose rm --volumes ${servcie}

# **************************************************************************** #
# for process
# **************************************************************************** #

.PHONY: logs # View output from containers
logs:
	docker compose logs ${service}

.PHONY: stop # Stop services
stop:
	docker compose stop ${service}

.PHONY: start # Start services
start:
	docker compose start ${service}

.PHONY: restart # Restart service containers
restart:
	docker compose restart ${service}

.PHONY: pause # Pause services
pause:
	docker compose pause ${service}

.PHONY: unpause # Unpause services
unpause:
	docker compose unpause ${service}

.PHONY: kill # Force stop service containers.
kill:
	docker compose kill ${service}

# **************************************************************************** #
# for service
# **************************************************************************** #

.PHONY: port # Print the public port for a port binding.
port:
	docker compose port --help

.PHONY: cp # Copy files/folders between a service container and the local filesystem
cp:
	docker compose cp --help

.PHONY: run # Run a one-off command on a service.
run:
	@[ -z "$(service)" ] && { echo "Usage: make run service=example"; exit 1; } || true
	$(eval command := $(or $(command),/bin/sh))
	docker compose run ${options} ${service} ${command} ${args}

.PHONY: exec # Execute a command in a running container.
exec:
	@[ -z "$(service)" ] && { echo "Usage: make exec service=example"; exit 1; } || true
	$(eval command := $(or $(command),/bin/sh))
	docker compose exec ${options} ${service} ${command} ${args}
