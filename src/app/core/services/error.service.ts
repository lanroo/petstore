import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorInfo {
  code: number;
  message: string;
  details?: string;
  timestamp: Date;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorInfo | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private router: Router) {}

  handleHttpError(error: any, context?: string): void {
    const errorInfo: ErrorInfo = {
      code: error.status || 500,
      message: this.getErrorMessage(error.status),
      details: error.message || context,
      timestamp: new Date(),
      url: window.location.href
    };

    this.errorSubject.next(errorInfo);
    
    this.logError(errorInfo);
    
    this.navigateToErrorPage(errorInfo.code);
  }

  handleApplicationError(error: Error, context?: string): void {
    const errorInfo: ErrorInfo = {
      code: 500,
      message: 'Erro interno da aplicação',
      details: error.message || context,
      timestamp: new Date(),
      url: window.location.href
    };

    this.errorSubject.next(errorInfo);
    
    this.logError(errorInfo);
    
    this.navigateToErrorPage(500);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  getCurrentError(): ErrorInfo | null {
    return this.errorSubject.value;
  }

  private navigateToErrorPage(code: number): void {
    switch (code) {
      case 404:
        this.router.navigate(['/errors/404']);
        break;
      case 500:
      default:
        this.router.navigate(['/errors/500']);
        break;
    }
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dados inválidos. Verifique as informações.';
      case 401:
        return 'Acesso não autorizado.';
      case 403:
        return 'Acesso negado.';
      case 404:
        return 'Página não encontrada.';
      case 405:
        return 'Operação não permitida.';
      case 408:
        return 'Tempo limite excedido.';
      case 429:
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 500:
        return 'Erro interno do servidor.';
      case 502:
        return 'Servidor temporariamente indisponível.';
      case 503:
        return 'Serviço temporariamente indisponível.';
      case 504:
        return 'Tempo limite do gateway.';
      default:
        return 'Algo deu errado. Tente novamente.';
    }
  }

  logError(error: ErrorInfo): void {
    console.error('Error logged:', {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      url: error.url
    });
  }
}
