import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


import { Notification, NotificationType, NotificationConfig } from '../models/notification.model';

import { NOTIFICATION_DEFAULTS, NOTIFICATION_MESSAGES } from '../constants/notification.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notifications$ = new BehaviorSubject<Notification[]>([]);
  
  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getNotificationsByType(type: NotificationType): Observable<Notification[]> {
    return this.notifications$.pipe(
      filter(notifications => notifications.some(n => n.type === type))
    );
  }

  showSuccess(title: string, message: string, config?: NotificationConfig): void {
    this.addNotification({
      type: NotificationType.SUCCESS,
      title,
      message,
      duration: config?.duration || NOTIFICATION_DEFAULTS.SUCCESS_DURATION,
      persistent: config?.persistent || false
    });
  }

  showError(title: string, message: string, config?: NotificationConfig): void {
    this.addNotification({
      type: NotificationType.ERROR,
      title,
      message,
      duration: config?.persistent ? NOTIFICATION_DEFAULTS.PERSISTENT_ERROR_DURATION : (config?.duration || NOTIFICATION_DEFAULTS.ERROR_DURATION),
      persistent: config?.persistent || false
    });
  }

  showWarning(title: string, message: string, config?: NotificationConfig): void {
    this.addNotification({
      type: NotificationType.WARNING,
      title,
      message,
      duration: config?.duration || NOTIFICATION_DEFAULTS.WARNING_DURATION,
      persistent: config?.persistent || false
    });
  }

  showInfo(title: string, message: string, config?: NotificationConfig): void {
    this.addNotification({
      type: NotificationType.INFO,
      title,
      message,
      duration: config?.duration || NOTIFICATION_DEFAULTS.INFO_DURATION,
      persistent: config?.persistent || false
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

  clearByType(type: NotificationType): void {
    const current = this.notifications$.value;
    const filtered = current.filter(notification => notification.type !== type);
    this.notifications$.next(filtered);
  }
  
  petCreated(petName: string): void {
    const message = NOTIFICATION_MESSAGES.PET_CREATED(petName);
    this.showSuccess(message.title, message.message);
  }

  petUpdated(petName: string): void {
    const message = NOTIFICATION_MESSAGES.PET_UPDATED(petName);
    this.showSuccess(message.title, message.message);
  }

  petDeleted(petName: string): void {
    const message = NOTIFICATION_MESSAGES.PET_DELETED(petName);
    this.showWarning(message.title, message.message);
  }

  petAdopted(petName: string): void {
    const message = NOTIFICATION_MESSAGES.PET_ADOPTED(petName);
    this.showSuccess(message.title, message.message, { duration: 8000 });
  }
  
  networkError(): void {
    const message = NOTIFICATION_MESSAGES.NETWORK_ERROR;
    this.showError(message.title, message.message, { persistent: true });
  }

  validationError(field: string): void {
    const message = NOTIFICATION_MESSAGES.VALIDATION_ERROR(field);
    this.showWarning(message.title, message.message);
  }

  unauthorizedError(): void {
    const message = NOTIFICATION_MESSAGES.UNAUTHORIZED_ERROR;
    this.showError(message.title, message.message);
  }

  serverError(): void {
    const message = NOTIFICATION_MESSAGES.SERVER_ERROR;
    this.showError(message.title, message.message, { persistent: true });
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
}