import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { DashboardService, DashboardStats, AdoptionRequest } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: AuthUser | null = null;
  stats: DashboardStats = {
    totalUsers: 0,
    totalPets: 0,
    totalAdoptions: 0,
    pendingAdoptions: 0
  };
  recentAdoptions: AdoptionRequest[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser || !this.authService.isAdmin()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadStats();
    
    this.loadRecentAdoptions();
  }

  loadStats(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.stats = {
          totalUsers: 0,
          totalPets: 0,
          totalAdoptions: 0,
          pendingAdoptions: 0
        };
      }
    });
  }

  loadRecentAdoptions(): void {
    this.dashboardService.getRecentAdoptions(10).subscribe({
      next: (adoptions) => {
        this.recentAdoptions = adoptions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent adoptions:', error);  
        this.recentAdoptions = [];
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPetName(adoption: AdoptionRequest): string {
    return adoption.pet?.name || 'Pet não encontrado';
  }

  getUserName(adoption: AdoptionRequest): string {
    return adoption.user?.full_name || adoption.full_name || 'Usuário não encontrado';
  }
}
