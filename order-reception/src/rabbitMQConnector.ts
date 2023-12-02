// rabbitMQConsumer.ts

import amqp from 'amqplib';

export async function conectarRabbitMQ() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'nombreDeTuCola';

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
        if (msg) {
            // Procesar el mensaje
            console.log('Mensaje recibido:', msg.content.toString());
            // Confirmar el mensaje como procesado
            channel.ack(msg);
        }
    });
}
