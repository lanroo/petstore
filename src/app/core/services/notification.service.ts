import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  
  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getNotificationsByType(type: Notification['type']): Observable<Notification[]> {
    return this.notifications$.pipe(
      filter(notifications => notifications.some(n => n.type === type))
    );
  }

  showSuccess(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  }

  showError(title: string, message: string, persistent: boolean = false): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? undefined : 8000
    });
  }

  showWarning(title: string, message: string, duration: number = 6000): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  showInfo(title: string, message: string, duration: number = 4000): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }

  remove(id: string): void {
    const current = this.notifications$.value;
    const filtered = current.filter(notification => notification.id !== id);
    this.notifications$.next(filtered);
  }

  clear(): void {
    this.notifications$.next([]);
  }

  clearByType(type: Notification['type']): void {
    const current = this.notifications$.value;
    const filtered = current.filter(notification => notification.type !== type);
    this.notifications$.next(filtered);
  }

  private addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date()
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, newNotification]);

    if (notification.duration && !notification.persistent) {
      setTimeout(() => {
        this.remove(newNotification.id);
      }, notification.duration);
    }
  }

  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  petCreated(petName: string): void {
    this.showSuccess(
      'Pet Cadastrado!', 
      `${petName} foi cadastrado com sucesso e está aguardando adoção.`
    );
  }

  petUpdated(petName: string): void {
    this.showSuccess(
      'Pet Atualizado!', 
      `As informações de ${petName} foram atualizadas.`
    );
  }

  petDeleted(petName: string): void {
    this.showWarning(
      'Pet Removido', 
      `${petName} foi removido da lista de adoção.`
    );
  }

  petAdopted(petName: string): void {
    this.showSuccess(
      'Pet Adotado! 🎉', 
      `${petName} encontrou uma família! Parabéns!`,
      8000
    );
  }
  
  networkError(): void {
    this.showError(
      'Erro de Conexão',
      'Verifique sua conexão com a internet e tente novamente.',
      true
    );
  }

  validationError(field: string): void {
    this.showWarning(
      'Dados Inválidos',
      `Por favor, verifique o campo: ${field}`
    );
  }

  unauthorizedError(): void {
    this.showError(
      'Acesso Negado',
      'Você não tem permissão para realizar esta ação.'
    );
  }

  serverError(): void {
    this.showError(
      'Erro no Servidor',
      'Ocorreu um erro interno. Nossa equipe foi notificada.',
      true
    );
  }
}