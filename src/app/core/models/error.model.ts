export interface ErrorInfo {
  readonly code: number;
  readonly message: string;
  readonly details?: string;
  readonly timestamp: Date;
  readonly url?: string;
}

export enum ErrorType {
  HTTP = 'http',
  APPLICATION = 'application',
  VALIDATION = 'validation',
  NETWORK = 'network'
}

export interface ErrorContext {
  readonly component?: string;
  readonly action?: string;
  readonly userId?: number;
  readonly additionalData?: Record<string, any>;
}
