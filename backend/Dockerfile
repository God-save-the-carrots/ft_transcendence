FROM python:3.10-alpine as build

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Create app directory
WORKDIR /src
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ---- Copy Files/Build ----
FROM build

WORKDIR /src

COPY . /src

RUN chmod -R 777 /src

CMD ["python3", "manage.py", "runserver"]
