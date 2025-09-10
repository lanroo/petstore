import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService, ErrorInfo } from '../../../../core/services/error.service';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit, OnDestroy {
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
        code: 404,
        message: 'Página não encontrada',
        details: 'A página que você está procurando não existe ou foi movida.',
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

  goBack(): void {
    this.errorService.clearError();
    window.history.back();
  }

  searchPets(): void {
    this.errorService.clearError();
    this.router.navigate(['/pets']);
  }
}
