import pika
import requests
import json
import asyncio
import threading


RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'filter-service'



def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        print("✅ Message received:", data)

        # Acknowledge the message
        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print("❌ Error:", e)


def start_consumer():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=False)
        print("🐇 RabbitMQ Consumer started...")

        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print("❌ RabbitMQ Error:", e)



def start_consumer_thread():
    thread = threading.Thread(target=start_consumer)
    thread.daemon = True
    thread.start()


start_consumer_thread()


try:
    while True:
        pass
except KeyboardInterrupt:
    print("Exiting...")