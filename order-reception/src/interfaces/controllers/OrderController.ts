import { Order } from "../../core/entities/Order";

export interface OrderRepository {
    saveOrder(order: Order): Promise<void>
}