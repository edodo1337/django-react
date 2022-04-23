FROM python:3.10.3

ENV PYTHONUNBUFFERED 1

WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r /code/requirements.txt

WORKDIR /code

COPY backend /code/backend/

WORKDIR /code/backend

EXPOSE 8080
