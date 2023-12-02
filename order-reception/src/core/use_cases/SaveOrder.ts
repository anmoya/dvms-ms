import { OrderRepository } from "../../interfaces/repositories/OrderRepository";
import { Order } from "../entities/Order";

export class SaveOrder {
    constructor(private orderRepo: OrderRepository) {

    }

    async execute(order: Order): Promise<Order> {
        await this.orderRepo.saveOrder(order);
        return order;
    }

}