import express from 'express';
import * as amqp from 'amqplib'
import { conectarRabbitMQ } from './rabbitMQConnector';
import { SaveOrder } from './core/use_cases/SaveOrder';
import { SQLiteOrderRepository } from './infrastructure/repositories/SimulatedOrderRepository';
import { Order } from './core/entities/Order';
import { MongoOrderRepository } from './infrastructure/repositories/RealOrderRepository';
import dotenv from 'dotenv';
import { RepositoryFactory } from './infrastructure/RepositoryFactory';



const app = express();

app.use(express.json())

const port = 3000;

async function publishOrderNotification(orderData: Order) {
    const connection = await amqp.connect('amqp://localhost'); // Cambiar con tu URL de RabbitMQ
    const channel = await connection.createChannel();
    const queue = 'orderNotifications';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)));

    console.log(" [x] Sent '%s'", orderData);
    setTimeout(() => {
        connection.close();
    }, 500);
}

// crear instancias
(async () => {
    dotenv.config();
    console.log(process.env)
    const orderRepo = await RepositoryFactory.createPedidoRepository();
    const crearPedido = new SaveOrder(orderRepo)
    app.post('/api/orders/notification', (req, res) => {
        console.log(req.body)
        publishOrderNotification(req.body)
        res.send('Recepción de Pedidos está funcionando!');
    });

    app.post('/api/orders', async (req, res) => {
        try {
            const body: Order = req.body
            console.log(body.id)
            const pedido = await crearPedido.execute(body);
            res.status(201).json(pedido);
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });

    // Iniciar el consumidor de RabbitMQ
    conectarRabbitMQ().then(() => {
        console.log('Consumidor de RabbitMQ iniciado');
    }).catch(err => {
        console.error('Error al iniciar el consumidor de RabbitMQ:', err);
    });
})()