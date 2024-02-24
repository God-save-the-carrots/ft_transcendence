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
