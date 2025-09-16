export interface Order {
  readonly id?: number;
  readonly petId: number;
  readonly quantity: number;
  readonly shipDate: string;
  readonly status: OrderStatus;
  readonly complete: boolean;
}

export enum OrderStatus {
  PLACED = 'placed',
  APPROVED = 'approved',
  DELIVERED = 'delivered'
}

export interface Inventory {
  readonly [status: string]: number;
}

export interface InventoryStats {
  readonly available: number;
  readonly pending: number;
  readonly sold: number;
  readonly total: number;
  readonly other: number;
}

export interface OrderRequest {
  readonly petId: number;
  readonly quantity: number;
  readonly shipDate: string;
  readonly status: OrderStatus;
  readonly complete: boolean;
}
