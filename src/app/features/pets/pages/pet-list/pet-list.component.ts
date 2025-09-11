import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../../../core/services/pet.service';
import { ImageService } from '../../../../core/services/image.service';
import { Pet, PetStatus } from '../../../../core/models/pet.model';
import { PetUtils } from '../../../../core/utils/pet.utils';
import { PageEvent } from '@angular/material/paginator';

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
  selectedCategory = '';
  totalPets = 0;
  pageSize = 12;
  currentPage = 0;
  

  constructor(
    private petService: PetService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    let filtered = [...this.pets];

    if (this.searchTerm) {
      filtered = filtered.filter(pet => 
        pet.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(pet => pet.status === this.selectedStatus);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(pet => {
        const petType = PetUtils.getPetType(pet).toLowerCase();
        return petType.includes(this.selectedCategory);
      });
    }

    this.filteredPets = filtered;
    this.totalPets = filtered.length;
    this.currentPage = 0;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  onCategoryFilter(): void {
    this.applyFilters();
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
  getStatusText = PetUtils.getStatusText;

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

}