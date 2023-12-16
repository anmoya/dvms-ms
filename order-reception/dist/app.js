"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const amqp = __importStar(require("amqplib"));
const rabbitMQConnector_1 = require("./rabbitMQConnector");
const SaveOrder_1 = require("./core/use_cases/SaveOrder");
const dotenv_1 = __importDefault(require("dotenv"));
const RepositoryFactory_1 = require("./infrastructure/RepositoryFactory");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
function publishOrderNotification(orderData) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqp.connect('amqp://localhost'); // Cambiar con tu URL de RabbitMQ
        const channel = yield connection.createChannel();
        const queue = 'orderNotifications';
        yield channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)));
        console.log(" [x] Sent '%s'", orderData);
        setTimeout(() => {
            connection.close();
        }, 500);
    });
}
// crear instancias
(() => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    console.log(process.env);
    const orderRepo = yield RepositoryFactory_1.RepositoryFactory.createPedidoRepository();
    const crearPedido = new SaveOrder_1.SaveOrder(orderRepo);
    app.post('/api/orders/notification', (req, res) => {
        console.log(req.body);
        publishOrderNotification(req.body);
        res.send('Recepción de Pedidos está funcionando!');
    });
    app.post('/api/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const body = req.body;
            console.log(body.id);
            const pedido = yield crearPedido.execute(body);
            res.status(201).json(pedido);
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }));
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
    // Iniciar el consumidor de RabbitMQ
    (0, rabbitMQConnector_1.conectarRabbitMQ)().then(() => {
        console.log('Consumidor de RabbitMQ iniciado');
    }).catch(err => {
        console.error('Error al iniciar el consumidor de RabbitMQ:', err);
    });
}))();
