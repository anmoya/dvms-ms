import { Order } from "../../core/entities/Order";
import { OrderRepository } from "../../interfaces/controllers/OrderController";
import { MongoClient, Db } from 'mongodb'

export class MongoOrderRepository implements OrderRepository {
    private db: Db | undefined;
    private client: MongoClient;
    private readonly collectionName = 'orders';

    constructor(private uri: string) {
        this.client = new MongoClient(uri);
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db();
    }

    async saveOrder(pedido: Order): Promise<void> {
        try {
            console.log(this.db)
            console.log(this.collectionName)
            const collection = this.db!.collection(this.collectionName);
            await collection.insertOne(pedido);
        } catch (err)
        {
            console.log(err)
        }
    }

    // Puedes agregar aquí más métodos para otras operaciones CRUD

    async disconnect(): Promise<void> {
        await this.client.close();
    }
}

