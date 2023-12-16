import { Order } from "../../core/entities/Order";

export interface OrderRepository {
    saveOrder(order: Order): Promise<void>;
    getOrder(): Promise<Order[]>;
    updateOrder(id: string | number, order: Order): Promise<void>;
}