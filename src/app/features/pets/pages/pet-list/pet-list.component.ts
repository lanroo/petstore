import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../../../core/services/pet.service';
import { ImageService } from '../../../../core/services/image.service';
import { Pet, PetStatus } from '../../../../core/models/pet.model';
import { PetUtils } from '../../../../core/utils/pet.utils';
import { PageEvent } from '@angular/material/paginator';

interface FilterCriteria {
  searchTerm: string;
  status: string;
  species: string;
  city: string;
  gender: string;
}

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_SORT_BY = 'name';
const DEFAULT_SORT_ORDER: 'asc' | 'desc' = 'asc';
const DEFAULT_VIEW_MODE: 'grid' | 'list' = 'grid';

@Component({
  selector: 'app-pet-list',
  standalone: false,
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss'
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  loading = true;
  
  searchTerm = '';
  selectedStatus = '';
  selectedSpecies = '';
  selectedCity = '';
  selectedGender = '';
  sortBy = DEFAULT_SORT_BY;
  sortOrder: 'asc' | 'desc' = DEFAULT_SORT_ORDER;
  totalPets = 0;
  pageSize = DEFAULT_PAGE_SIZE;
  currentPage = 0;
  favoritePets: Set<number> = new Set();
  viewMode: 'grid' | 'list' = DEFAULT_VIEW_MODE;
  sortDropdownOpen = false;
  filtersExpanded = true;
  

  constructor(
    private petService: PetService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadViewMode();
    this.loadPets();
  }

  private loadPets(): void {
    this.loading = true;

    this.petService.getPetsByStatus(PetStatus.AVAILABLE).subscribe({
      next: (pets) => {
        this.pets = pets;
        this.filteredPets = [...this.pets];
        this.totalPets = this.pets.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pets:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const filterCriteria = this.buildFilterCriteria();
    let filtered = this.filterPetsByCriteria(this.pets, filterCriteria);
    filtered = this.applySorting(filtered);
    this.updateFilteredResults(filtered);
  }

  private buildFilterCriteria(): FilterCriteria {
    return {
      searchTerm: this.searchTerm,
      status: this.selectedStatus,
      species: this.selectedSpecies,
      city: this.selectedCity,
      gender: this.selectedGender
    };
  }

  private filterPetsByCriteria(pets: Pet[], criteria: FilterCriteria): Pet[] {
    return pets.filter(pet => {
      if (criteria.searchTerm && !this.matchesSearchTerm(pet, criteria.searchTerm)) {
        return false;
      }
      if (criteria.status && pet.status !== criteria.status) {
        return false;
      }
      if (criteria.species && pet.species !== criteria.species) {
        return false;
      }
      if (criteria.city && pet.city !== criteria.city) {
        return false;
      }
      if (criteria.gender && pet.gender !== criteria.gender) {
        return false;
      }
      return true;
    });
  }

  private matchesSearchTerm(pet: Pet, searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      pet.name?.toLowerCase().includes(term) ||
      pet.breed?.toLowerCase().includes(term) ||
      pet.description?.toLowerCase().includes(term)
    );
  }

  private updateFilteredResults(filtered: Pet[]): void {
    this.filteredPets = filtered;
    this.totalPets = filtered.length;
    this.currentPage = 0;
  }

  private applySorting(pets: Pet[]): Pet[] {
    return pets.sort((a, b) => {
      const aValue = this.getSortValue(a, this.sortBy);
      const bValue = this.getSortValue(b, this.sortBy);
      return this.compareValues(aValue, bValue);
    });
  }

  private getSortValue(pet: Pet, sortBy: string): any {
    switch (sortBy) {
      case 'name':
        return pet.name?.toLowerCase() || '';
      case 'age':
        return pet.age || 0;
      case 'species':
        return pet.species || '';
      case 'city':
        return pet.city?.toLowerCase() || '';
      default:
        return pet.name?.toLowerCase() || '';
    }
  }

  private compareValues(aValue: any, bValue: any): number {
    if (aValue < bValue) {
      return this.sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return this.sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearFilters(): void {
    this.resetFilterValues();
    this.resetSortingValues();
    this.applyFilters();
  }

  private resetFilterValues(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedSpecies = '';
    this.selectedCity = '';
    this.selectedGender = '';
  }

  private resetSortingValues(): void {
    this.sortBy = DEFAULT_SORT_BY;
    this.sortOrder = DEFAULT_SORT_ORDER;
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
  getPetBreed = PetUtils.getPetBreed;
  getPetGender = PetUtils.getPetGender;
  getPetDescription = PetUtils.getPetDescription;
  getStatusText = PetUtils.getStatusText;

  scrollToFilters(): void {
    const filtersElement = document.getElementById('filters');
    if (filtersElement) {
      filtersElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private loadFavorites(): void {
    const saved = localStorage.getItem('favoritePets');
    if (saved) {
      try {
        const favoriteIds = JSON.parse(saved);
        this.favoritePets = new Set(favoriteIds);
      } catch (error) {
        console.error('Error loading favorites:', error);
        this.favoritePets = new Set();
      }
    }
  }

  private saveFavorites(): void {
    const favoriteIds = Array.from(this.favoritePets);
    localStorage.setItem('favoritePets', JSON.stringify(favoriteIds));
  }

  toggleFavorite(petId: number | undefined, event: Event): void {
    event.stopPropagation();
    if (petId) {
      if (this.favoritePets.has(petId)) {
        this.favoritePets.delete(petId);
      } else {
        this.favoritePets.add(petId);
      }
      this.saveFavorites();
    }
  }

  isFavorite(petId: number | undefined): boolean {
    return petId ? this.favoritePets.has(petId) : false;
  }

  private loadViewMode(): void {
    const saved = localStorage.getItem('petViewMode');
    if (saved && (saved === 'grid' || saved === 'list')) {
      this.viewMode = saved;
    }
  }

  private saveViewMode(): void {
    localStorage.setItem('petViewMode', this.viewMode);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.saveViewMode();
  }

  showFavorites(): void {
    if (this.favoritePets.size > 0) {
      this.filteredPets = this.pets.filter(pet => pet.id && this.favoritePets.has(pet.id));
      this.totalPets = this.filteredPets.length;
    } else {
      this.filteredPets = [...this.pets];
      this.totalPets = this.pets.length;
    }
    this.scrollToFilters();
  }

  sharePet(pet: Pet, event: Event): void {
    event.stopPropagation();
    
    const shareData = {
      title: `${pet.name} - Pet para Adoção`,
      text: `Conheça ${pet.name}, um ${this.getPetType(pet).toLowerCase()} ${this.getPetAge(pet)} em ${pet.city}. ${pet.description}`,
      url: `${window.location.origin}/pets/${pet.id}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Link copiado para a área de transferência!');
      }).catch(console.error);
    }
  }

  viewPet(id: number | undefined, event: Event): void {
    if (id) {
      event.stopPropagation();
      this.router.navigate(['/pets', id]);
    }
  }

  onImageError = (event: Event): void => this.imageService.handleImageError(event);

  getPetImage(pet: Pet): string {
    return this.imageService.getPetImage(pet, 'small');
  }
  
  toggleSortDropdown(): void {
    this.sortDropdownOpen = !this.sortDropdownOpen;
  }

  selectSortOption(option: string): void {
    this.sortBy = option;
    this.sortDropdownOpen = false;
    this.onFilterChange();
  }

  getSortLabel(sortBy: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Nome',
      'age': 'Idade',
      'species': 'Espécie',
      'city': 'Cidade'
    };
    return labels[sortBy] || 'Nome';
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    this.saveViewMode();
  }

  toggleFiltersExpanded(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.sortDropdownOpen = false;
    }
  }

}