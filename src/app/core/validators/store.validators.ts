import { Order, OrderRequest, OrderStatus } from '../models/store.model';

export class StoreValidators {
  static validateOrderId(id: number): void {
    if (!id || id <= 0 || !Number.isInteger(id)) {
      throw new Error('ID do pedido deve ser um número inteiro positivo');
    }
  }

  static validateOrderRequest(order: OrderRequest): void {
    if (!order.petId || order.petId <= 0 || !Number.isInteger(order.petId)) {
      throw new Error('ID do pet deve ser um número inteiro positivo');
    }
    if (!order.quantity || order.quantity <= 0 || !Number.isInteger(order.quantity)) {
      throw new Error('Quantidade deve ser um número inteiro positivo');
    }
    if (!order.shipDate || !this.isValidDate(order.shipDate)) {
      throw new Error('Data de envio deve ser uma data válida');
    }
    if (!order.status || !Object.values(OrderStatus).includes(order.status)) {
      throw new Error('Status do pedido inválido');
    }
  }

  static validateOrderUpdate(order: Partial<Order>): void {
    if (order.quantity !== undefined && (order.quantity <= 0 || !Number.isInteger(order.quantity))) {
      throw new Error('Quantidade deve ser um número inteiro positivo');
    }
    if (order.shipDate && !this.isValidDate(order.shipDate)) {
      throw new Error('Data de envio deve ser uma data válida');
    }
    if (order.status && !Object.values(OrderStatus).includes(order.status)) {
      throw new Error('Status do pedido inválido');
    }
  }

  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}
