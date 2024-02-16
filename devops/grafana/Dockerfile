FROM grafana/grafana:latest

USER root

RUN apk update && \
    apk add postgresql-client

USER grafana

RUN chmod 755 /var/lib/grafana
RUN mkdir -p /var/lib/grafana/sessions
RUN chmod 755 /var/lib/grafana/sessions

COPY ./src/defaults.ini /etc/grafana/
COPY ./src/datasource.yaml /etc/grafana/provisioning/datasources/


# set dashboards
# RUN mkdir -p /var/lib/grafana/dashboards
# COPY ./dashboards/dashboard.json /var/lib/grafana/dashboards/dashboard.json
COPY ./src/dashboards.yaml /usr/share/grafana/conf/provisioning/dashboards/


COPY --chmod=777 src/entrypoint.sh /entrypoint.sh
CMD ["/entrypoint.sh" ]
