import { Order } from "../../core/entities/Order";
import { OrderRepository } from "../../interfaces/controllers/OrderController";
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'


export class SQLiteOrderRepository implements OrderRepository {
    private db: Database | undefined;

    constructor() {
        this.initializeDatabase()
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