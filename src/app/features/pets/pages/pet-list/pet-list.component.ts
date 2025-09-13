import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { PetService } from '../../../../core/services/pet.service';
import { ImageService } from '../../../../core/services/image.service';
import { Pet } from '../../../../core/models/pet.model';
import { PetUtils } from '../../../../core/utils/pet.utils';
import { PET_LIST_CONFIG } from './constants/pet-list.constants';
import { FilterState } from './interfaces/pet-list.interfaces';
import { createShareData, getSortLabel } from './utils/pet-list.utils';
import { PetListStorageService } from './services/pet-list-storage.service';

@Component({
  selector: 'app-pet-list',
  standalone: false,
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetListComponent implements OnInit, OnDestroy {
  readonly config = PET_LIST_CONFIG;
  
  private readonly destroy$ = new Subject<void>();
  private readonly filterSubject$ = new Subject<void>();
  private lastRequestTime = 0;
  
  pets: readonly Pet[] = [];
  filteredPets: readonly Pet[] = [];
  favoritePets: ReadonlySet<number> = new Set();
  
  searchTerm = '';
  selectedStatus: FilterState['selectedStatus'] = '';
  selectedSpecies: FilterState['selectedSpecies'] = '';
  selectedCity = '';
  selectedGender: FilterState['selectedGender'] = '';
  
  
  totalPets = 0;
  pageSize: number = PET_LIST_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
  currentPage = 0;
  first: number = PET_LIST_CONFIG.PAGINATION.DEFAULT_FIRST;
  rows: number = PET_LIST_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
  
  loading = true;
  
  

  constructor(
    private readonly petService: PetService,
    private readonly imageService: ImageService,
    private readonly router: Router,
    private readonly storageService: PetListStorageService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.filterSubject$
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadPets());
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private initializeComponent(): void {
    this.loadPersistedData();
    this.loadPets();
  }

  private loadPersistedData(): void {
    this.favoritePets = this.storageService.loadFavorites();
  }

  private loadPets(): void {
    const currentTime = Date.now();
    this.lastRequestTime = currentTime;
    
    console.log('🔄 Pet List - Loading pets...');
    this.setLoadingState(true);

    const filters = this.buildApiFilters();
    console.log('🔍 Pet List - Filters:', filters);
    
    this.petService.getPets(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Pet List - API Response received:', response);
          if (this.lastRequestTime === currentTime) {
            this.handlePetsLoaded(response.pets, response.total);
          }
        },
        error: (error) => {
          console.error('❌ Pet List - API Error:', error);
          if (this.lastRequestTime === currentTime) {
            this.handlePetsLoadError(error);
          }
        }
      });
  }

  private handlePetsLoaded(pets: Pet[], total?: number): void {
    console.log('🐾 Pet List - Pets loaded:', pets);
    if (pets && Array.isArray(pets)) {
      this.pets = pets;
      this.totalPets = total || pets.length; 
      this.filteredPets = pets;
    } else {
      console.warn('⚠️ Pet List - Invalid pets data:', pets);
      this.pets = [];
      this.totalPets = 0;
      this.filteredPets = [];
    }
    this.setLoadingState(false);
  }

  private handlePetsLoadError(error: any): void {
    console.error('Error loading pets:', error);
    this.setLoadingState(false);
  }

  private setLoadingState(loading: boolean): void {
    this.loading = loading;
    this.cdr.markForCheck();
  }

  onFilterChange(): void {
    this.first = 0; 
    this.currentPage = 0;
    this.filterSubject$.next();
  }

  onSelectChange(): void {
    this.first = 0; 
    this.currentPage = 0;
    this.loadPets();
  }

  private buildApiFilters(): any {
    const filters: any = {
      status: 'available',
      limit: this.pageSize,
      page: this.currentPage
    };

    if (this.selectedStatus) {
      filters.status = this.selectedStatus;
    }
    if (this.selectedSpecies) {
      filters.species = this.selectedSpecies;
    }
    if (this.selectedCity) {
      filters.city = this.selectedCity;
    }
    if (this.selectedGender) {
      filters.gender = this.selectedGender;
    }
    if (this.searchTerm?.trim()) {
      filters.q = this.searchTerm.trim();
    }

    return filters;
  }



  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedSpecies = '';
    this.selectedCity = '';
    this.selectedGender = '';
    this.first = 0;
    this.currentPage = 0;
    this.loadPets();
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
  getPetBreed = PetUtils.getPetBreed;
  getPetGender = PetUtils.getPetGender;
  getPetDescription = PetUtils.getPetDescription;
  getStatusText = PetUtils.getStatusText;
  
  get pageSizeOptions(): number[] {
    return [...this.config.PAGINATION.PAGE_SIZE_OPTIONS];
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
    this.storageService.saveFavorites(newFavorites);
    this.cdr.markForCheck();
  }

  isFavorite(petId: number | undefined): boolean {
    return petId ? this.favoritePets.has(petId) : false;
  }



  showFavorites(): void {
    if (this.favoritePets.size > 0) {
      this.filteredPets = this.pets.filter(pet => pet.id && this.favoritePets.has(pet.id));
      this.totalPets = this.filteredPets.length;
    } else {
      this.filteredPets = this.pets;
      this.totalPets = this.pets.length;
    }
    this.cdr.markForCheck();
  }

  sharePet(pet: Pet, event: Event): void {
    event.stopPropagation();
    
    const shareData = createShareData(pet, window.location.origin);

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(shareText)
        .then(() => console.log('Link copiado para a área de transferência!'))
        .catch(console.error);
    }
  }

  viewPet(id: number | undefined, event: Event): void {
    if (!id) return;
    
    event.stopPropagation();
    this.router.navigate(['/pets', id]);
  }

  onImageError = (event: Event): void => this.imageService.handleImageError(event);

  getPetImage(pet: Pet): string {
    return this.imageService.getPetImage(pet, 'small');
  }
  



  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadPets(); 
  }

  trackByPetId(index: number, pet: Pet): number | undefined {
    return pet.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

}