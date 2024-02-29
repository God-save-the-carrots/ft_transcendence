if [ -e frontend/server_private_key.pem ]
then
    echo "Use an existing certificate"
else
    echo "create local test certificate"
    openssl genpkey -algorithm rsa -out server_private_key.pem
    openssl req -new -key server_private_key.pem -out certificate.csr -subj "/C=KR/ST=Seoul/L=City/O=God-save-the-carrots/CN=localhost"
    openssl x509 -req -in certificate.csr -signkey server_private_key.pem -sha256 -out server_certificate.pem -days 365
    rm certificate.csr
    mv server_private_key.pem frontend/
    mv server_certificate.pem frontend/
fi

if [ -e devops/grafana/grafana.key ]
then
    echo "Use an existing grafana certificate"
else
    echo "create local grafana certificate"
    openssl genrsa -out grafana.key 2048
    openssl req -new -key grafana.key -out grafana.csr -subj "/C=KR/ST=Seoul/L=City/O=God-save-the-carrots/CN=localhost"
    openssl x509 -req -days 365 -in grafana.csr -signkey grafana.key -out grafana.crt
    rm grafana.csr
    mv grafana.key devops/grafana/
    mv grafana.crt devops/grafana/
fi

if [ -e devops/prometheus/prometheus.key ]
then
    echo "Use an existing prometheus certificate"
else
    echo "create local prometheus certificate"
    openssl genrsa -out prometheus.key 2048
    openssl req -new -key prometheus.key -out prometheus.csr -subj "/C=KR/ST=Seoul/L=City/O=God-save-the-carrots/CN=localhost"
    openssl x509 -req -days 365 -in prometheus.csr -signkey prometheus.key -out prometheus.crt
    rm prometheus.csr
    mv prometheus.key devops/prometheus/
    mv prometheus.crt devops/prometheus/
fi