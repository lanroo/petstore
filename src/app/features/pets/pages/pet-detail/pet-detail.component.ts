import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  activeTab: 'info' | 'characteristics' | 'health' | 'adoption' | 'care' = 'info';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    if (this.pet && this.pet.id) {
      this.router.navigate(['/pets/adoption', this.pet.id]);
    } else {
      this.router.navigate(['/pets/adoption']);
    }
  }

}