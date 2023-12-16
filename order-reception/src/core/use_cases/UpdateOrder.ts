import { OrderRepository } from "../../interfaces/repositories/OrderRepository"
import { Order } from "../entities/Order"

export class UpdateOrderUseCase {
    constructor(private orderRepo: OrderRepository)
    {}

    async execute(id: string | number, order: Order): Promise<void> {
        await this.orderRepo.updateOrder(id, order)
    }
}