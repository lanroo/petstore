import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  styleUrl: './pet-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPetDetails();
    
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.checkTabsScroll();
      }, 100);
    });
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
        this.cdr.markForCheck();
        
        setTimeout(() => {
          this.checkTabsScroll();
        }, 100);
      },
      error: (error) => {
        this.error = error.message || 'Erro ao carregar detalhes do pet';
        this.loading = false;
        this.cdr.markForCheck();
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
      this.cdr.markForCheck();
    }
  }

  previousImage(): void {
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.pet.photos.length - 1 
        : this.currentImageIndex - 1;
      this.cdr.markForCheck();
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  closeFullscreenModal(): void {
    this.showFullscreenModal = false;
    document.body.style.overflow = 'auto';
    this.cdr.markForCheck();
  }

  nextFullscreenImage(event: Event): void {
    event.stopPropagation();
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.fullscreenImageIndex = (this.fullscreenImageIndex + 1) % this.pet.photos.length;
      this.cdr.markForCheck();
    }
  }

  previousFullscreenImage(event: Event): void {
    event.stopPropagation();
    if (this.pet && this.pet.photos && this.pet.photos.length > 1) {
      this.fullscreenImageIndex = this.fullscreenImageIndex === 0 
        ? this.pet.photos.length - 1 
        : this.fullscreenImageIndex - 1;
      this.cdr.markForCheck();
    }
  }

  selectFullscreenImage(index: number, event: Event): void {
    event.stopPropagation();
    this.fullscreenImageIndex = index;
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  // Verifica se há conteúdo para scroll no carrossel de tabs
  private checkTabsScroll(): void {
    const carousel = document.querySelector('.tabs-carousel') as HTMLElement;
    if (carousel) {
      const hasScroll = carousel.scrollWidth > carousel.clientWidth;
      
      if (hasScroll) {
        carousel.classList.add('has-scroll');
        carousel.classList.remove('scrolled');
        
        this.addScrollListener(carousel);
      } else {
        carousel.classList.remove('has-scroll');
        carousel.classList.remove('scrolled');
      }
    }
  }

  private addScrollListener(carousel: HTMLElement): void {
    const handleScroll = () => {
      if (carousel.scrollLeft > 0) {
        carousel.classList.add('scrolled');
      } else {
        carousel.classList.remove('scrolled');
      }
    };
    
    carousel.removeEventListener('scroll', handleScroll);
    
    carousel.addEventListener('scroll', handleScroll);
  }


  navigateToAdoption(): void {
    if (this.pet && this.pet.id) {
      this.router.navigate(['/pets/adoption', this.pet.id]);
    } else {
      this.router.navigate(['/pets/adoption']);
    }
  }

}