FROM nginx:alpine

WORKDIR /src

RUN apk update \
    && apk upgrade \
    && apk add --no-cache --upgrade bash

COPY ./public/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
