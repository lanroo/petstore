import { Component, HostListener, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../core/services/pet.service';
import { ImageService } from '../../core/services/image.service';
import { StoreService } from '../../core/services/store.service';
import { AuthService } from '../../core/services/auth.service';
import { Pet, PetStatus } from '../../core/models/pet.model';
import { PetUtils } from '../../core/utils/pet.utils';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('petsCarousel', { static: false }) petsCarousel!: ElementRef;
  
  showScrollIndicator = true;
  
  totalPetsAdopted = 0;
  totalPetsAvailable = 0;
  adoptedPets: Pet[] = [];
  availablePets: Pet[] = [];
  recentAdoptedPets: Pet[] = [];
  todayAdoptions = 0;
  
  currentSlide = 0;
  translateX = 0;
  cardWidth = 320; 
  cardsPerView = 4;
  maxSlide = 0;
  dots: number[] = [];
  
  touchStartX = 0;
  touchEndX = 0;
  isDragging = false;
  isAnimating = false;
  
  favoritePets: ReadonlySet<number> = new Set();

  constructor(
    private petService: PetService,
    private imageService: ImageService,
    private storeService: StoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.loadPetStats();
    this.loadFavorites();
    this.updateCarouselDimensions();
  }

  private loadPetStats(): void {
    this.petService.getPets({ status: PetStatus.ADOPTED, limit: 50 }).subscribe({
      next: (response) => {
        this.adoptedPets = response.pets.filter(pet => pet.name && pet.name !== 'null');
        this.totalPetsAdopted = this.adoptedPets.length;
        this.recentAdoptedPets = this.adoptedPets.slice(0, 5);
        this.todayAdoptions = Math.min(12, this.adoptedPets.length); 
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.todayAdoptions = 12; 
      }
    });

    const filters: any = {
      status: 'available',
      limit: 12
    };
    
    this.petService.getPets(filters).subscribe({
      next: (response) => {
        if (response && response.pets && Array.isArray(response.pets)) {
          this.availablePets = response.pets; 
          this.totalPetsAvailable = response.total || response.pets.length;
        } else {
          this.availablePets = [];
          this.totalPetsAvailable = 0;
        }
        this.updateCarouselSettings();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.availablePets = [];
        this.totalPetsAvailable = 0;
        this.cdr.markForCheck();
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollIndicator = scrollTop < 100;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateCarouselDimensions();
  }

  onImageError = (event: Event): void => this.imageService.handleImageError(event);

  getPetImage(pet: Pet): string {
    return this.imageService.getPetImage(pet, 'small');
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
  getPetBreed = PetUtils.getPetBreed;
  
  private loadFavorites(): void {
    // Simple favorites loading from localStorage
    const stored = localStorage.getItem('favoritePets');
    this.favoritePets = stored ? new Set(JSON.parse(stored)) : new Set();
  }
  
  private updateCarouselDimensions(): void {
    const width = window.innerWidth;
    
    if (width < 480) {
      this.cardsPerView = 1;
      this.cardWidth = Math.min(300, width - 48); 
    } else if (width < 768) {
      this.cardsPerView = 1;
      this.cardWidth = Math.min(350, width - 48);
    } else if (width < 1024) {
      this.cardsPerView = 2;
      this.cardWidth = (width - 96) / 2; 
    } else if (width < 1440) {
      this.cardsPerView = 3;
      this.cardWidth = 320;
    } else {
      this.cardsPerView = 4;
      this.cardWidth = 320;
    }
    
    this.updateCarouselSettings();
  }
  
  private updateCarouselSettings(): void {
    if (this.availablePets.length > 0) {
      this.maxSlide = Math.max(0, Math.ceil(this.availablePets.length / this.cardsPerView) - 1);
      this.dots = Array(this.maxSlide + 1).fill(0).map((_, i) => i);
      this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
      this.updateTranslateX();
    }
  }
  
  private updateTranslateX(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.translateX = -this.currentSlide * this.cardWidth * this.cardsPerView;
    this.cdr.markForCheck();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }
  
  nextSlide(): void {
    if (this.currentSlide < this.maxSlide && !this.isAnimating) {
      this.currentSlide++;
      this.updateTranslateX();
    }
  }
  
  previousSlide(): void {
    if (this.currentSlide > 0 && !this.isAnimating) {
      this.currentSlide--;
      this.updateTranslateX();
    }
  }
  
  goToSlide(slideIndex: number): void {
    if (slideIndex !== this.currentSlide && !this.isAnimating) {
      this.currentSlide = slideIndex;
      this.updateTranslateX();
    }
  }
    
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.isDragging = true;
  }
  
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    
    this.touchEndX = event.touches[0].clientX;
    
    const deltaX = Math.abs(this.touchEndX - this.touchStartX);
    if (deltaX > 10) {
      event.preventDefault();
    }
  }
  
  onTouchEnd(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    const deltaX = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
    
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
  
  onMouseDown(event: MouseEvent): void {
    this.touchStartX = event.clientX;
    this.isDragging = true;
    event.preventDefault();
  }
  
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.touchEndX = event.clientX;
  }
  
  onMouseUp(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    const deltaX = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
    
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
  
  toggleFavorite(petId: number | undefined, event: Event): void {
    event.stopPropagation();
    if (!petId) return;

    const newFavorites = new Set(this.favoritePets);
    if (newFavorites.has(petId)) {
      newFavorites.delete(petId);
    } else {
      newFavorites.add(petId);
    }
    
    this.favoritePets = newFavorites;
    localStorage.setItem('favoritePets', JSON.stringify([...newFavorites]));
    this.cdr.markForCheck();
  }
  
  isFavorite(petId: number | undefined): boolean {
    return petId ? this.favoritePets.has(petId) : false;
  }
  
  viewPet(id: number | undefined, event: Event): void {
    if (!id) return;
    event.stopPropagation();
    this.router.navigate(['/pets', id]);
  }
  
  sharePet(pet: Pet, event: Event): void {
    event.stopPropagation();
    
    const shareData = {
      title: `${pet.name} - Pet Store`,
      text: `Conheça ${pet.name}, um ${pet.species} ${pet.breed || 'mestiço'} disponível para adoção!`,
      url: `${window.location.origin}/pets/${pet.id}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(shareText)
        .then(() => {})
        .catch(() => {});
    }
  }
  
  trackByPetId(index: number, pet: Pet): number | undefined {
    return pet.id;
  }
}