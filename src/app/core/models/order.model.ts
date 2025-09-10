export interface Order {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    status?: OrderStatus;
    complete?: boolean;
  }
  
  export enum OrderStatus {
    PLACED = 'placed',
    APPROVED = 'approved',
    DELIVERED = 'delivered'
  }