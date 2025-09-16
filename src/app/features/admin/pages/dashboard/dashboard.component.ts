import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { DashboardService, DashboardStats, AdoptionRequest } from '../../../../core/services/dashboard.service';
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
    
    // Escutar novas adoções para atualizar a lista automaticamente
    this.adoptionService.adoptionCreated.subscribe(() => {
      console.log('🔄 Dashboard - Nova adoção detectada, recarregando lista...');
      this.loadRecentAdoptions();
    });
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

  goToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }


  // Método para exportar dados em JSON
  // Propriedades para o modal de detalhes
  showAdoptionModal = false;
  selectedAdoption: any = null;

  // Método para mostrar detalhes da adoção
  showAdoptionDetails(adoption: any): void {
    console.log('🔍 Mostrando detalhes da adoção:', adoption);
    console.log('🔍 WhatsApp no objeto adoption:', adoption.whatsapp);
    console.log('🔍 Phone no objeto adoption:', adoption.phone);
    console.log('🔍 Pet photos no objeto adoption:', adoption.pet?.photos);
    console.log('🔍 Pet needsFullData:', adoption.pet?.needsFullData);
    console.log('🔍 Todos os campos do adoption:', Object.keys(adoption));
    
    // Se o pet não tem fotos, buscar dados completos
    if (adoption.pet?.needsFullData) {
      console.log('🔍 Buscando dados completos do pet...');
      this.loadPetDetails(adoption.pet_id, adoption);
    } else {
      this.selectedAdoption = adoption;
      this.showAdoptionModal = true;
    }
  }

  // Método para carregar detalhes completos do pet
  private loadPetDetails(petId: number, adoption: any): void {
    this.petService.getPetById(petId).subscribe({
      next: (pet) => {
        console.log('🔍 Pet completo carregado:', pet);
        console.log('🔍 Pet photos:', pet.photos);
        
        // Atualizar o objeto adoption com os dados completos do pet
        adoption.pet = pet;
        this.selectedAdoption = adoption;
        this.showAdoptionModal = true;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pet:', error);
        // Mesmo com erro, mostrar o modal com os dados que temos
        this.selectedAdoption = adoption;
        this.showAdoptionModal = true;
      }
    });
  }

  // Método para fechar o modal
  closeAdoptionModal(): void {
    this.showAdoptionModal = false;
    this.selectedAdoption = null;
  }

  // Método para tratamento de erro de imagem
  onImageError(event: any): void {
    console.log('❌ Erro ao carregar imagem do pet');
    event.target.src = '/assets/default-pet.png';
  }

  // Método para exibir raça
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

  // Método para obter imagem do pet (igual aos cards dos pets)
  getPetImage(pet: any): string {
    return this.imageService.getPetImage(pet, 'large');
  }

  // Método para aprovar adoção
  approveAdoption(): void {
    if (this.selectedAdoption) {
      console.log('✅ Aprovando adoção:', this.selectedAdoption.id);
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
      
      // Criar arquivo JSON
      const dataStr = JSON.stringify(adoptions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Criar link para download
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `adoption-requests-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      // Limpar URL
      URL.revokeObjectURL(url);
      
      console.log('📊 Dados exportados:', adoptions);
      alert(`📊 Dados exportados com sucesso! (${adoptions.length} pedidos)`);
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      alert('❌ Erro ao exportar dados de adoção.');
    }
  }
}
