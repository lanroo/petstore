import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Models
import { Order, InventoryStats, OrderRequest } from '../models/store.model';

// Export Inventory interface for external use
export interface Inventory {
  readonly [status: string]: number;
}

// Constants
import { STORE_API_ENDPOINTS, STORE_ERROR_MESSAGES, INVENTORY_STATUSES } from '../constants/store.constants';

// Validators
import { StoreValidators } from '../validators/store.validators';

// Utils
import { ErrorHandlerUtil } from '../utils/error-handler.util';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getInventory(): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}${STORE_API_ENDPOINTS.INVENTORY}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  placeOrder(order: OrderRequest): Observable<Order> {
    StoreValidators.validateOrderRequest(order);
    
    return this.http.post<Order>(`${this.apiUrl}${STORE_API_ENDPOINTS.ORDER}`, order)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleCreateUserError(error))
      );
  }

  getOrderById(orderId: number): Observable<Order> {
    StoreValidators.validateOrderId(orderId);
    
    return this.http.get<Order>(`${this.apiUrl}${STORE_API_ENDPOINTS.ORDER_BY_ID(orderId)}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  deleteOrder(orderId: number): Observable<{ message?: string }> {
    StoreValidators.validateOrderId(orderId);
    
    return this.http.delete<{ message?: string }>(`${this.apiUrl}${STORE_API_ENDPOINTS.ORDER_BY_ID(orderId)}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleDeleteUserError(error))
      );
  }

  getInventoryStats(): Observable<InventoryStats> {
    return this.getInventory().pipe(
      map((inventory) => this.mapToInventoryStats(inventory)),
      catchError(error => ErrorHandlerUtil.handleGetUserError(error))
    );
  }

  private mapToInventoryStats(inventory: Inventory): InventoryStats {
    // Create mutable object first
    const mutableStats = {
      available: inventory[INVENTORY_STATUSES.AVAILABLE] || 0,
      pending: inventory[INVENTORY_STATUSES.PENDING] || 0,
      sold: inventory[INVENTORY_STATUSES.SOLD] || 0,
      total: 0,
      other: 0
    };

    Object.entries(inventory).forEach(([status, count]) => {
      mutableStats.total += count;
      
      if (!Object.values(INVENTORY_STATUSES).includes(status as any)) {
        mutableStats.other += count;
      }
    });

    // Return as readonly object
    return mutableStats as InventoryStats;
  }
}