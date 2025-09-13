import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { DashboardService, AdoptionRequest } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: AuthUser | null = null;
  userAdoptions: AdoptionRequest[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadUserData();
  }

  loadUserData(): void {
    if (this.currentUser) {
      this.dashboardService.getUserAdoptions(this.currentUser.id).subscribe({
        next: (adoptions) => {
          this.userAdoptions = adoptions;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user adoptions:', error);
          this.userAdoptions = [];
          this.isLoading = false;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToPets(): void {
    this.router.navigate(['/pets']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Desconhecido';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getPetName(adoption: AdoptionRequest): string {
    return adoption.pet?.name || 'Pet não encontrado';
  }

  getPetImage(adoption: AdoptionRequest): string {
    if (adoption.pet && (adoption.pet as any).photos && (adoption.pet as any).photos.length > 0) {
      return (adoption.pet as any).photos[0];
    }
    
    return '/assets/images/img-pets2.png';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('img-pets2.png')) {
      target.src = '/assets/images/img-pets2.png';
    }
  }
}
