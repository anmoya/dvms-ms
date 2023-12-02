import { OrderRepository } from "../interfaces/repositories/OrderRepository";
import { MongoOrderRepository } from "./repositories/RealOrderRepository";
import { SQLiteOrderRepository } from "./repositories/SimulatedOrderRepository";

export class RepositoryFactory {
    static async createPedidoRepository(): Promise<OrderRepository> {
        if (process.env.DB_TYPE === 'mongodb') {
            const mongodbUri = process.env.MONGO_URI || ''
            const mongoRepo = new MongoOrderRepository(mongodbUri);
            await mongoRepo.connect();
            return mongoRepo;
        } else {
            // Por defecto, usar SQLite o cualquier otra base de datos
            return new SQLiteOrderRepository();
        }
    }
}