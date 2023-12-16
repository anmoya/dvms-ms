import { OrderRepository } from '../../interfaces/repositories/OrderRepository';
import { Order } from '../entities/Order';


export class ObtenerPedidosUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async ejecutar(): Promise<Order[]> {
        return this.orderRepository.getOrder()
    }
}