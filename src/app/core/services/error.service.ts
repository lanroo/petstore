import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { ErrorInfo, ErrorType, ErrorContext } from '../models/error.model';

import { ERROR_MESSAGES, ERROR_ROUTES, HTTP_STATUS_CODES } from '../constants/error.constants';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly errorSubject = new BehaviorSubject<ErrorInfo | null>(null);
  public readonly error$ = this.errorSubject.asObservable();

  constructor(private readonly router: Router) {}

  handleHttpError(error: any, context?: ErrorContext): void {
    const errorInfo: ErrorInfo = {
      code: error.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: this.getErrorMessage(error.status),
      details: error.message || context?.action,
      timestamp: new Date(),
      url: window.location.href
    };

    this.errorSubject.next(errorInfo);
    this.logError(errorInfo, context);
    this.navigateToErrorPage(errorInfo.code);
  }

  handleApplicationError(error: Error, context?: ErrorContext): void {
    const errorInfo: ErrorInfo = {
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.APPLICATION_ERROR,
      details: error.message || context?.action,
      timestamp: new Date(),
      url: window.location.href
    };

    this.errorSubject.next(errorInfo);
    this.logError(errorInfo, context);
    this.navigateToErrorPage(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  handleValidationError(message: string, context?: ErrorContext): void {
    const errorInfo: ErrorInfo = {
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: message,
      timestamp: new Date(),
      url: window.location.href
    };

    this.errorSubject.next(errorInfo);
    this.logError(errorInfo, context);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  getCurrentError(): ErrorInfo | null {
    return this.errorSubject.value;
  }

  private navigateToErrorPage(code: number): void {
    switch (code) {
      case HTTP_STATUS_CODES.NOT_FOUND:
        this.router.navigate([ERROR_ROUTES.NOT_FOUND]);
        break;
      case HTTP_STATUS_CODES.UNAUTHORIZED:
        this.router.navigate([ERROR_ROUTES.UNAUTHORIZED]);
        break;
      case HTTP_STATUS_CODES.FORBIDDEN:
        this.router.navigate([ERROR_ROUTES.FORBIDDEN]);
        break;
      case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
      default:
        this.router.navigate([ERROR_ROUTES.SERVER_ERROR]);
        break;
    }
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS_CODES.BAD_REQUEST:
        return ERROR_MESSAGES.INVALID_DATA;
      case HTTP_STATUS_CODES.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS_CODES.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS_CODES.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS_CODES.METHOD_NOT_ALLOWED:
        return ERROR_MESSAGES.METHOD_NOT_ALLOWED;
      case HTTP_STATUS_CODES.TIMEOUT:
        return ERROR_MESSAGES.TIMEOUT;
      case HTTP_STATUS_CODES.TOO_MANY_REQUESTS:
        return ERROR_MESSAGES.TOO_MANY_REQUESTS;
      case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      case HTTP_STATUS_CODES.BAD_GATEWAY:
        return ERROR_MESSAGES.BAD_GATEWAY;
      case HTTP_STATUS_CODES.SERVICE_UNAVAILABLE:
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      case HTTP_STATUS_CODES.GATEWAY_TIMEOUT:
        return ERROR_MESSAGES.GATEWAY_TIMEOUT;
      default:
        return ERROR_MESSAGES.GENERIC;
    }
  }

  private logError(error: ErrorInfo, context?: ErrorContext): void {
    const logData = {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      url: error.url,
      context: context
    };
  }
}