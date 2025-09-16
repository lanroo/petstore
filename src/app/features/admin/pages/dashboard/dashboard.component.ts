import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { DashboardService, AdoptionRequest } from '../../../../core/services/dashboard.service';
import { AdoptionService } from '../../../../core/services/adoption.service';
import { ImageService } from '../../../../core/services/image.service';
import { PetService } from '../../../../core/services/pet.service';
import { Pet } from '../../../../core/models/pet.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: AuthUser | null = null;
  recentAdoptions: AdoptionRequest[] = [];
  isLoading = true;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService,
    private adoptionService: AdoptionService,
    private imageService: ImageService,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser || !this.authService.isAdmin()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadDashboardData();

    this.adoptionService.adoptionCreated.subscribe(() => {
      this.loadRecentAdoptions();
    });
  }

  loadDashboardData(): void {
    this.loadRecentAdoptions();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }


  loadRecentAdoptions(): void {
    this.dashboardService.getRecentAdoptions(10).subscribe({
      next: (adoptions) => {
        this.recentAdoptions = adoptions;
        this.isLoading = false;
      },
      error: (error) => {
        this.recentAdoptions = [];
        this.isLoading = false;
      }
    });
  }


  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
      case 'PENDENTE':
        return 'status-pending';
      case 'approved':
      case 'APROVADA':
        return 'status-approved';
      case 'rejected':
      case 'REJEITADA':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
      case 'PENDENTE':
        return 'Pendente';
      case 'approved':
      case 'APROVADA':
        return 'Aprovada';
      case 'rejected':
      case 'REJEITADA':
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

  goToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userDropdown = target.closest('.user-dropdown');
    
    if (!userDropdown) {
      this.showUserMenu = false;
    }
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }


  showAdoptionModal = false;
  selectedAdoption: any = null;

  showAdoptionDetails(adoption: any): void {
    // Se o pet não tem fotos, buscar dados completos
    if (adoption.pet?.needsFullData) {
      this.loadPetDetails(adoption.pet_id, adoption);
    } else {
      this.selectedAdoption = adoption;
      this.showAdoptionModal = true;
    }
  }

  private loadPetDetails(petId: number, adoption: any): void {
    this.petService.getPetById(petId).subscribe({
      next: (pet) => {

        adoption.pet = pet;
        this.selectedAdoption = adoption;
        this.showAdoptionModal = true;
      },
      error: (error) => {
        this.selectedAdoption = adoption;
        this.showAdoptionModal = true;
      }
    });
  }


  closeAdoptionModal(): void {
    this.showAdoptionModal = false;
    this.selectedAdoption = null;
  }


  onImageError(event: any): void {
    event.target.src = '/assets/default-pet.png';
  }


  getBreedDisplay(breed: string, species: string): string {
    if (breed === 'Vira-lata' && species === 'dog') {
      return 'SRD';
    } else if (breed === 'Sem raça definida' && species === 'cat') {
      return 'SRD';
    } else if (breed && breed.trim()) {
      return breed;
    } else {
      return 'SRD';
    }
  }


  getPetImage(pet: any): string {
    return this.imageService.getPetImage(pet, 'large');
  }


  approveAdoption(): void {
    if (this.selectedAdoption) {
      // Aqui você pode implementar a lógica para aprovar a adoção
      alert(`Adoção #${this.selectedAdoption.id} aprovada com sucesso!`);
      this.closeAdoptionModal();
    }
  }

  exportAdoptionData(): void {
    try {
      const stored = localStorage.getItem('local_adoptions');
      const adoptions = stored ? JSON.parse(stored) : [];
      
      if (adoptions.length === 0) {
        alert('📊 Nenhum pedido de adoção para exportar.');
        return;
      }
      

      const dataStr = JSON.stringify(adoptions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `adoption-requests-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      

      URL.revokeObjectURL(url);
      
      alert(`📊 Dados exportados com sucesso! (${adoptions.length} pedidos)`);
    } catch (error) {
      alert('❌ Erro ao exportar dados de adoção.');
    }
  }
}
