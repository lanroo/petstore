export interface Notification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly duration?: number;
  readonly persistent?: boolean;
  readonly timestamp: Date;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface NotificationConfig {
  readonly duration?: number;
  readonly persistent?: boolean;
  readonly autoClose?: boolean;
}
