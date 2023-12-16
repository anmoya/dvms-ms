import { Order } from "../../core/entities/Order";
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { OrderRepository } from "../../interfaces/repositories/OrderRepository";


export class SQLiteOrderRepository implements OrderRepository {
    private db: Database | undefined;

    constructor() {
        this.initializeDatabase()
    }
    updateOrder(id: string | number, order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getOrder(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    private async initializeDatabase() {
        this.db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        await this.db.run('DROP TABLE IF EXISTS orders')

        await this.db.run('CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, detalles TEXT)');
    }

    async saveOrder(pedido: Order): Promise<void> {
        if (!this.db)
        {
            throw new Error('sqlite problem')
        }
        await this.db.run(
            'INSERT INTO orders (id, detalles) VALUES (?, ?)',
            pedido.id
        );
    }
}