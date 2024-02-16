#!/bin/sh

# --config 재정의
(grafana server \
    --config /etc/grafana/grafana.ini \
    --homepath /usr/share/grafana)