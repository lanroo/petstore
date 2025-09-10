import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService, ErrorInfo } from '../../../../core/services/error.service';

@Component({
  selector: 'app-server-error',
  standalone: false,
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss'
})
export class ServerErrorComponent implements OnInit, OnDestroy {
  errorInfo: ErrorInfo | null = null;
  private errorSubscription?: Subscription;

  constructor(
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.errorSubscription = this.errorService.error$.subscribe(error => {
      this.errorInfo = error;
    });

    this.errorInfo = this.errorService.getCurrentError();
    
    if (!this.errorInfo) {
      this.errorInfo = {
        code: 500,
        message: 'Erro interno do servidor',
        details: 'Algo deu errado no nosso servidor. Nossa equipe foi notificada.',
        timestamp: new Date(),
        url: window.location.href
      };
    }
  }

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  goHome(): void {
    this.errorService.clearError();
    this.router.navigate(['/']);
  }

  retry(): void {
    this.errorService.clearError();
    window.location.reload();
  }

  contactSupport(): void {
    window.open('mailto:support@petstore.com?subject=Erro 500 - ' + this.errorInfo?.url, '_blank');
  }
}
