import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { DashboardService, AdoptionRequest } from '../../../../core/services/dashboard.service';
import { AdoptionService } from '../../../../core/services/adoption.service';
import { ImageService } from '../../../../core/services/image.service';
import { PetService } from '../../../../core/services/pet.service';

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
    this.isLoading = true;
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
  showApprovalModal = false;

  showAdoptionDetails(adoption: any): void {
  
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
    this.showApprovalModal = true;
  }

  confirmApproval(): void {
    if (this.selectedAdoption) {
    
      const adoptionIndex = this.recentAdoptions.findIndex(adoption => adoption.id === this.selectedAdoption.id);
      if (adoptionIndex !== -1) {
        this.recentAdoptions[adoptionIndex] = {
          ...this.recentAdoptions[adoptionIndex],
          status: 'APROVADA'
        };
      }
      
      this.selectedAdoption = {
        ...this.selectedAdoption,
        status: 'APROVADA'
      };

      this.saveAdoptionToLocalStorage(this.selectedAdoption);
      
      this.closeApprovalModal();
      this.closeAdoptionModal();
    }
  }

  private saveAdoptionToLocalStorage(adoption: any): void {
    try {

      const stored = localStorage.getItem('local_adoptions');
      const adoptions = stored ? JSON.parse(stored) : [];
      

      const adoptionIndex = adoptions.findIndex((ad: any) => ad.id === adoption.id);
      if (adoptionIndex !== -1) {
        adoptions[adoptionIndex] = {
          ...adoptions[adoptionIndex],
          status: 'APROVADA',
          updated_at: new Date().toISOString()
        };
      } else {

        adoptions.push({
          ...adoption,
          status: 'APROVADA',
          updated_at: new Date().toISOString()
        });
      }
      
      
      localStorage.setItem('local_adoptions', JSON.stringify(adoptions));
    } catch (error) {
      console.error('Erro ao salvar adoção no localStorage:', error);
    }
  }

  closeApprovalModal(): void {
    this.showApprovalModal = false;
  }

  getWhatsAppUrl(whatsapp: string): string {
    if (!whatsapp) return '';
    const cleanNumber = whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  }

}
