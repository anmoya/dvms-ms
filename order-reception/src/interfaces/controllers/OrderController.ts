import { Order } from "../../core/entities/Order";
import { ObtenerPedidosUseCase } from "../../core/use_cases/GetOrder";
import { Request, Response } from 'express'
import { UpdateOrderUseCase } from "../../core/use_cases/UpdateOrder";

import * as amqp from 'amqplib'
import { SaveOrder } from "../../core/use_cases/SaveOrder";

export class OrderController {
    constructor(
        private obtenerPedidosUseCase: ObtenerPedidosUseCase,
        private updateOrderUseCase: UpdateOrderUseCase,
        private saveOrderUseCase: SaveOrder) { }

    async getPedidos(req: Request, res: Response) {
        try {
            const pedidos = await this.obtenerPedidosUseCase.ejecutar();
            res.json(pedidos);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async updatePedido(req: Request, res: Response) {
        try {
            const { id } = req.params
            const order = req.body

            // validate request query and body
            if (!id) {
                throw new Error("Order ID is required");

            }
            await this.updateOrderUseCase.execute(id?.toString(), order)
        } catch (error) {
            res.status(500).send(error)
        }
    }
    
    async notificateOrder(req: Request, res: Response) {
        try {

            console.log(req.body)
            await this.publishOrderNotification(req.body)
            res.send('Recepción de Pedidos está funcionando!');

        } catch (error) {

        }
    }

    async createOrder(req: Request, res: Response) {
        try {
            const body: Order = req.body
            console.log(body.id)
            const pedido = await this.saveOrderUseCase.execute(body);
            res.status(201).json(pedido);
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    }

    async publishOrderNotification(orderData: Order) {
        const connection = await amqp.connect(process.env.RABBITMQ_URI as string); // Cambiar con tu URL de RabbitMQ
        const channel = await connection.createChannel();
        const queue = 'orderNotifications';
    
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)));
    
        console.log(" [x] Sent '%s'", orderData);
        setTimeout(() => {
            connection.close();
        }, 500);
    }
}