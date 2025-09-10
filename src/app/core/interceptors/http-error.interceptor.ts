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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService
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
    let errorTitle = 'Erro na Requisição';
    let errorMessage = 'Algo deu errado. Tente novamente.';
    let showNotification = true;

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
        case 403:
          errorTitle = 'Acesso Negado';
          errorMessage = 'Você não tem permissão para realizar esta ação.';
          break;
        case 404:
          errorTitle = 'Não Encontrado';
          errorMessage = 'O recurso solicitado não foi encontrado.';
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
        case 500:
          errorTitle = 'Erro do Servidor';
          errorMessage = 'Erro interno do servidor. Nossa equipe foi notificada.';
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

    
    console.error('HTTP Error:', {
      status: error.status,
      message: error.message,
      url: error.url,
      error: error.error
    });

    
    if (showNotification) {
      this.notificationService.showError(errorTitle, errorMessage);
    }
  }
}
