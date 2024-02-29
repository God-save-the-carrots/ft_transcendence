FROM nginx:alpine

WORKDIR /src

RUN apk update \
    && apk upgrade \
    && apk add --no-cache --upgrade bash

COPY ./public/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./server_certificate.pem /etc/ssl/certs/server.crt
COPY ./server_private_key.pem /etc/ssl/certs/private.key

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
