FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 8000

ENTRYPOINT ["python3","manage.py","runserver","0.0.0.0:8000"]
