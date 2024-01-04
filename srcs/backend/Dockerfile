# **************************************************************************** #
# build
# **************************************************************************** #
FROM python:3.10-alpine as build

RUN apk add --no-cache gcc musl-dev

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# **************************************************************************** #
# release
# **************************************************************************** #
FROM python:3.10-alpine as release
RUN apk add libpq && adduser -D django
COPY --from=build /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

WORKDIR /app
USER django
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
CMD ["python3", "manage.py", "runserver"]
