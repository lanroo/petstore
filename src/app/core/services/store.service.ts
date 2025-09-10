import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Order {
  id?: number;
  petId: number;
  quantity: number;
  shipDate: string;
  status: OrderStatus;
  complete: boolean;
}

export enum OrderStatus {
  PLACED = 'placed',
  APPROVED = 'approved',
  DELIVERED = 'delivered'
}

export interface Inventory {
  [status: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/store/inventory`)
      .pipe(
        catchError(this.handleError)
      );
  }

  placeOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/store/order`, order)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/store/order/${orderId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteOrder(orderId: number): Observable<{ message?: string }> {
    return this.http.delete<{ message?: string }>(`${this.apiUrl}/store/order/${orderId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInventoryStats(): Observable<{
    available: number;
    pending: number;
    sold: number;
    total: number;
    other: number;
  }> {
    return this.getInventory().pipe(
      map((inventory) => {
        const stats = {
          available: inventory['available'] || 0,
          pending: inventory['pending'] || 0,
          sold: inventory['sold'] || 0,
          total: 0,
          other: 0
        };

        Object.entries(inventory).forEach(([status, count]) => {
          stats.total += count;
          
          if (!['available', 'pending', 'sold'].includes(status)) {
            stats.other += count;
          }
        });

        return stats;
      }),
      catchError(() => {
        return throwError(() => new Error('Erro ao carregar inventário'));
      })
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Erro na operação da loja. Tente novamente.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dados do pedido inválidos.';
          break;
        case 404:
          errorMessage = 'Pedido não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('StoreService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
