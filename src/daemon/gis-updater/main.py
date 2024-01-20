import pika
import sys
import time
import logging

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60
ENTITIES_PER_ITERATION = int(sys.argv[2]) if len(sys.argv) >= 3 else 10

logging.basicConfig(level=logging.DEBUG)

def callback(ch, method, properties, body):
    print(f"Received a delayed message: {body}")
    # TODO: Add the code to process the message as needed

if __name__ == "__main__":
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672, virtual_host='is', credentials=pika.PlainCredentials('is', 'is')))
        channel = connection.channel()
        channel.queue_declare(queue='update-gis_counties_queue', durable=True)
        channel.basic_consume(queue='update-gis_counties_queue', on_message_callback=callback, auto_ack=True)

        print('Waiting for delayed messages. To exit press CTRL+C')

        while True:
            # Add logic to retrieve entities without coordinates
            print(f"Getting up to {ENTITIES_PER_ITERATION} entities without coordinates...")

            # Wait for the polling frequency before the next iteration
            time.sleep(POLLING_FREQ)

        channel.start_consuming()

    except pika.exceptions.AMQPConnectionError as e:
        print(f"Error connecting to RabbitMQ: {e}")
