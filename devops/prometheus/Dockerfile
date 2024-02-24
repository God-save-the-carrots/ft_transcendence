FROM prom/prometheus:latest

ENV PROMETHEUS_CONFIG_FILE=/etc/prometheus/prometheus.yml

COPY ./src/ /etc/prometheus/

CMD ["--config.file=/etc/prometheus/prometheus.yml"]
