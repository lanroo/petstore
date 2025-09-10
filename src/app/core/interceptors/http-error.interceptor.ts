import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';
import { ErrorService } from '../services/error.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private errorService: ErrorService
  ) {}

  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    this.loadingService.show();

    
    const modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleHttpError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse): void {
    console.error('HTTP Error:', {
      status: error.status,
      message: error.message,
      url: error.url,
      error: error.error
    });

    if (this.shouldRedirectToErrorPage(error.status)) {
      this.errorService.handleHttpError(error, 'HTTP Request');
      return;
    }

    let errorTitle = 'Erro na Requisição';
    let errorMessage = 'Algo deu errado. Tente novamente.';

    if (error.error instanceof ErrorEvent) {
      errorTitle = 'Erro de Conexão';
      errorMessage = 'Verifique sua conexão com a internet.';
    } else {
      switch (error.status) {
        case 400:
          errorTitle = 'Dados Inválidos';
          errorMessage = 'Verifique os dados enviados e tente novamente.';
          break;
        case 401:
          errorTitle = 'Não Autorizado';
          errorMessage = 'Você precisa estar logado para acessar este recurso.';
          break;
        case 405:
          errorTitle = 'Método Não Permitido';
          errorMessage = 'Esta operação não é permitida.';
          break;
        case 408:
          errorTitle = 'Timeout';
          errorMessage = 'A requisição demorou muito para responder. Tente novamente.';
          break;
        case 429:
          errorTitle = 'Muitas Requisições';
          errorMessage = 'Aguarde um momento antes de tentar novamente.';
          break;
        case 502:
          errorTitle = 'Serviço Indisponível';
          errorMessage = 'O serviço está temporariamente indisponível.';
          break;
        case 503:
          errorTitle = 'Serviço Indisponível';
          errorMessage = 'O serviço está em manutenção. Tente mais tarde.';
          break;
        case 0:
          errorTitle = 'Sem Conexão';
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua internet.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    this.notificationService.showError(errorTitle, errorMessage);
  }

  private shouldRedirectToErrorPage(status: number): boolean {
    return [404, 500].includes(status);
  }
}
