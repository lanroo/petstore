import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PetService } from '../../../../core/services/pet.service';
import { ImageService } from '../../../../core/services/image.service';
import { Pet } from '../../../../core/models/pet.model';
import { PetUtils } from '../../../../core/utils/pet.utils';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-pet-detail',
  standalone: false,
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.scss'
})
export class PetDetailComponent implements OnInit, OnDestroy {
  pet: Pet | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;
  showFullscreenModal = false;
  fullscreenImageIndex = 0;
  isPetFavorite = false;
  showShareModal = false;
  
  activeTab: 'info' | 'characteristics' | 'health' | 'adoption' | 'care' = 'info';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private petService: PetService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPetDetails();
  }

  loadPetDetails(): void {
    const petId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!petId || isNaN(petId)) {
      this.error = 'ID do pet inválido';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.petService.getPetById(petId).subscribe({
      next: (pet) => {
        this.pet = pet;
        this.loading = false;
        this.checkIfFavorite();
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do pet:', error);
        this.error = error.message || 'Erro ao carregar detalhes do pet';
        this.loading = false;
      }
    });
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
  getPetGender = PetUtils.getPetGender;
  getStatusText = PetUtils.getStatusText;
  getStatusColor = PetUtils.getStatusColor;
  getPetDescription = PetUtils.getPetDescription;
  isAvailable = PetUtils.isAvailable;

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/pets']);
    }
  }

  getPetImage(index: number = 0): string {
    if (!this.pet || !this.pet.photos || this.pet.photos.length === 0) {
      return this.imageService.getPetImage(this.pet!, 'large');
    }
    return this.pet.photos[index] || this.imageService.getPetImage(this.pet, 'large');
  }

  nextImage(): void {
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.pet.photos.length;
    }
  }

  previousImage(): void {
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.pet.photos.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  onImageError(event: Event): void {
    this.imageService.handleImageError(event);
  }


  contactAboutPet(): void {
    if (!this.pet) return;
    
    const message = `Olá! Tenho interesse no pet ${this.pet.name}. Poderia me fornecer mais informações?`;
    const phoneNumber = '5591985464442';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  }

  shareProfile(): void {
    if (!this.pet) return;

    const shareUrl = window.location.href;
    const shareTitle = `Conheça ${this.pet.name} - ${this.getPetType(this.pet)} para adoção`;
    const shareText = `${this.pet.name} é um ${this.getPetType(this.pet).toLowerCase()} ${this.getPetGender(this.pet).toLowerCase()} de ${this.getPetAge(this.pet)} disponível para adoção em ${this.getPetLocation(this.pet)}. ${this.getPetDescription(this.pet)}`;

    this.showShareOptions(shareUrl, shareTitle, shareText);
  }

  private showShareOptions(url: string, title: string, text: string): void {
    this.showShareModal = true;
    (window as any).shareData = { url, title, text };
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  shareWithFullInfoModal(): void {
    const data = (window as any).shareData;
    this.shareWithFullInfo(data.url, data.title, data.text);
    this.closeShareModal();
  }

  copyLinkOnlyModal(): void {
    const data = (window as any).shareData;
    this.copyLinkOnly(data.url);
    this.closeShareModal();
  }

  private shareWithFullInfo(url: string, title: string, text: string): void {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      }).then(() => {
        this.notificationService.showSuccess('Perfil compartilhado com sucesso!', 'Sucesso');
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
        this.copyToClipboard(url, title, text);
      });
    } else {
      this.copyToClipboard(url, title, text);
    }
  }

  private copyLinkOnly(url: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.notificationService.showSuccess('Link copiado para a área de transferência!', 'Sucesso');
      }).catch(() => {
        this.fallbackCopyToClipboard(url);
      });
    } else {
      this.fallbackCopyToClipboard(url);
    }
  }

  private copyToClipboard(url: string, title: string, text: string): void {
    const shareContent = `${title}\n\n${text}\n\n🔗 ${url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareContent).then(() => {
        this.notificationService.showSuccess('Link e informações copiados para a área de transferência!', 'Sucesso');
      }).catch(() => {
        this.fallbackCopyToClipboard(shareContent);
      });
    } else {
      this.fallbackCopyToClipboard(shareContent);
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.notificationService.showSuccess('Link e informações copiados para a área de transferência!', 'Sucesso');
    } catch (err) {
      console.error('Erro ao copiar para área de transferência:', err);
      this.notificationService.showError('Não foi possível copiar o link. Tente novamente.', 'Erro');
    } finally {
      document.body.removeChild(textArea);
    }
  }

  viewRelatedPets(): void {
    this.router.navigate(['/pets'], {
      queryParams: { 
        species: this.pet?.species,
        city: this.pet?.city
      }
    });
  }

  openImageFullscreen(index: number): void {
    this.fullscreenImageIndex = index;
    this.showFullscreenModal = true;
    document.body.style.overflow = 'hidden'; 
  }

  closeFullscreenModal(): void {
    this.showFullscreenModal = false;
    document.body.style.overflow = 'auto';
  }

  nextFullscreenImage(event: Event): void {
    event.stopPropagation();
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.fullscreenImageIndex = (this.fullscreenImageIndex + 1) % this.pet.photos.length;
    }
  }

  previousFullscreenImage(event: Event): void {
    event.stopPropagation();
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.fullscreenImageIndex = this.fullscreenImageIndex === 0 
        ? this.pet.photos.length - 1 
        : this.fullscreenImageIndex - 1;
    }
  }

  selectFullscreenImage(index: number, event: Event): void {
    event.stopPropagation();
    this.fullscreenImageIndex = index;
  }

  private checkIfFavorite(): void {
    if (this.pet) {
      const favorites = JSON.parse(localStorage.getItem('favoritePets') || '[]');
      this.isPetFavorite = favorites.includes(this.pet.id);
    }
  }

  togglePetFavorite(): void {
    this.isPetFavorite = !this.isPetFavorite;
    if (this.pet) {
      const favorites = JSON.parse(localStorage.getItem('favoritePets') || '[]');
      if (this.isPetFavorite) {
        favorites.push(this.pet.id);
        this.notificationService.showSuccess('Pet adicionado aos favoritos!', 'Favoritos');
      } else {
        const index = favorites.indexOf(this.pet.id);
        if (index > -1) favorites.splice(index, 1);
        this.notificationService.showSuccess('Pet removido dos favoritos!', 'Favoritos');
      }
      localStorage.setItem('favoritePets', JSON.stringify(favorites));
    }
  }

  getAgeCategory(pet: Pet): string {
    const ageInMonths = pet.age;
    if (ageInMonths < 6) return 'Filhote';
    if (ageInMonths < 24) return 'Jovem';
    if (ageInMonths < 84) return 'Adulto';
    return 'Idoso';
  }

  ngOnDestroy(): void {
    if (this.showFullscreenModal) {
      document.body.style.overflow = 'auto';
    }
  }

  switchTab(tab: 'info' | 'characteristics' | 'health' | 'adoption' | 'care'): void {
    this.activeTab = tab;
  }

  navigateToAdoption(): void {
    console.log('🚀 navigateToAdoption called');
    console.log('🐾 Current pet:', this.pet);
    if (this.pet && this.pet.id) {
      console.log('✅ Navigating to adoption with pet ID:', this.pet.id);
      this.router.navigate(['/pets/adoption', this.pet.id]);
    } else {
      console.log('⚠️ No pet ID, navigating to general adoption form');
      this.router.navigate(['/pets/adoption']);
    }
  }
}