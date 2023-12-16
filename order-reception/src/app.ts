import express from 'express';
import { SaveOrder } from './core/use_cases/SaveOrder';
import dotenv from 'dotenv';
import { RepositoryFactory } from './infrastructure/RepositoryFactory';
import { ObtenerPedidosUseCase } from './core/use_cases/GetOrder';
import { OrderController } from './interfaces/controllers/OrderController';
import { UpdateOrderUseCase } from './core/use_cases/UpdateOrder';



const app = express();

app.use(express.json())

const port = 3000;



// crear instancias
(async () => {
    dotenv.config();
    console.log(process.env)

    // Dependencies
    // TODO: are there DI Containers for NODE?
    const orderRepo = await RepositoryFactory.createPedidoRepository();
    const saveOrderUseCase = new SaveOrder(orderRepo)
    const obtenerPedidosUseCase = new ObtenerPedidosUseCase(orderRepo)
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepo)
    const pedidoController = new OrderController(obtenerPedidosUseCase, updateOrderUseCase, saveOrderUseCase)

    app.post('/api/orders/notification', (req, res) => pedidoController.notificateOrder(req, res));
    app.post('/api/orders', (req, res) => pedidoController.createOrder(req, res));
    app.get('/api/orders', (req, res) => pedidoController.getPedidos(req, res))
    app.put('/api/orders/:id', (req, res) => pedidoController.updatePedido(req, res))

    app.listen(port, () => {
        console.log(`Running on http://localhost:${port}`);
    });
})()