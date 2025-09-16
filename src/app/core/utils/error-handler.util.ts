import { Observable, throwError } from 'rxjs';
import { HttpStatus } from '../models/user.model';
import { ERROR_MESSAGES } from '../constants/api.constants';

export class ErrorHandlerUtil {
  static handleCreateUserError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.INVALID_DATA);
  }

  static handleBulkCreateError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.VALIDATION_FAILED);
  }

  static handleGetUserError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  static handleUpdateUserError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.INVALID_DATA);
  }

  static handleDeleteUserError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  static handleLoginError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.UNAUTHORIZED);
  }

  static handleGetProfileError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.UNAUTHORIZED);
  }

  static handleLogoutError(error: any): Observable<never> {
    return this.handleError(error, ERROR_MESSAGES.GENERIC);
  }

  private static handleError(error: any, defaultMessage: string): Observable<never> {
    const errorMessage = this.getErrorMessage(error, defaultMessage);
    return throwError(() => new Error(errorMessage));
  }

  private static getErrorMessage(error: any, defaultMessage: string): string {
    if (error.error instanceof ErrorEvent) {
      return ERROR_MESSAGES.NETWORK;
    }

    switch (error.status) {
      case HttpStatus.BAD_REQUEST:
        return ERROR_MESSAGES.INVALID_DATA;
      case HttpStatus.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HttpStatus.NOT_FOUND:
        return ERROR_MESSAGES.USER_NOT_FOUND;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return defaultMessage;
    }
  }
}
