import pika
import sys
import time
import json

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10

def callback(ch, method, properties, body):
    print(f"Received a delayed message: {body}")

if __name__ == "__main__":
    connection = pika.BlockingConnection(pika.ConnectionParameters('broker', virtual_host='is', credentials=pika.PlainCredentials('is', 'is')))
    channel = connection.channel()
    channel.queue_declare(queue='update-gis_counties_queue', durable=True)
    channel.basic_consume(queue='update-gis_counties_queue', on_message_callback=callback, auto_ack=True)
    while True:
        print(f"Getting up to {ENTITIES_PER_ITERATION} entities without coordinates...")
        # !TODO: 1- Use api-gis to retrieve a fixed amount of entities without coordinates (e.g. 100 entities per iteration, use ENTITIES_PER_ITERATION)
        # !TODO: 2- Use the entity information to retrieve coordinates from an external API
        # !TODO: 3- Submit the changes
        time.sleep(POLLING_FREQ)

    channel.start_consuming()
