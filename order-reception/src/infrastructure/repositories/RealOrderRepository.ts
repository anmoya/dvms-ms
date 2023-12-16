import { Order } from "../../core/entities/Order";
import { MongoClient, Db, ObjectId } from 'mongodb'
import { OrderRepository } from "../../interfaces/repositories/OrderRepository";

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
        } catch (err) {
            console.log(err)
        }
    }

    async getOrder(): Promise<Order[]> {
        try {
            const collection = this.db!.collection(this.collectionName)

            const order = await collection.find<Order>({}).toArray()

            return order
        } catch (error) {
            throw new Error("");
        }
    }

    async updateOrder(id: string | number, order: Order): Promise<void> {
        try {

            const collection = this.db!.collection(this.collectionName)

            const order2 = await collection.findOne({ $or: [{ id: id }]})

            console.log(order2)

            if (!order2)
            {
                throw new Error(`Order ${id} does not exist`)
            }

            await collection.updateOne({ _id: order2._id }, order)

            console.log(order2)
        } catch (error) {
            console.log(error)
            throw new Error(error as string)
        }
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }
}

