FROM grafana/grafana:latest

USER root

RUN apk update && \
    apk add postgresql-client

USER grafana

ENV DS_PROMETHEUS=Prometheus

RUN mkdir -p /var/lib/grafana/sessions

COPY ./src/grafana.ini /etc/grafana/grafana.ini
COPY ./src/datasources.yaml /etc/grafana/provisioning/datasources/datasources.yaml

# set dashboards
COPY --chmod=777 ./dashboards/*.json /etc/grafana/dashboards/
COPY ./src/dashboards.yaml /etc/grafana/provisioning/dashboards/dashboards.yaml

COPY --chmod=777 src/entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh" ]