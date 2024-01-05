# **************************************************************************** #
# build
# **************************************************************************** #
FROM python:3.10-alpine as build

RUN apk add --no-cache gcc musl-dev

COPY requirements.txt /requirements.txt

# cffi module dependency
RUN apk add libffi-dev
RUN pip install --no-cache-dir -r /requirements.txt

# **************************************************************************** #
# release
# **************************************************************************** #
FROM python:3.10-alpine as release
RUN apk add libpq && adduser -D django
COPY --from=build /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

WORKDIR /src
USER django
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
EXPOSE 4444
EXPOSE 5555
CMD ["python3", "manage.py", "runserver", "--nothreading"]
