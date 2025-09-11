import { Component, HostListener, OnInit } from '@angular/core';
import { PetService } from '../../core/services/pet.service';
import { ImageService } from '../../core/services/image.service';
import { StoreService } from '../../core/services/store.service';
import { Pet, PetStatus } from '../../core/models/pet.model';
import { PetUtils } from '../../core/utils/pet.utils';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  showScrollIndicator = true;
  
  totalPetsAdopted = 0;
  totalPetsAvailable = 0;
  adoptedPets: Pet[] = [];
  availablePets: Pet[] = [];
  recentAdoptedPets: Pet[] = [];
  todayAdoptions = 0;

  constructor(
    private petService: PetService,
    private imageService: ImageService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loadPetStats();
    this.loadInventoryStats();
  }

  private loadPetStats(): void {
    this.petService.getPetsByStatus(PetStatus.ADOPTED).subscribe({
      next: (pets) => {
        this.adoptedPets = pets.filter(pet => pet.name && pet.name !== 'null');
        this.totalPetsAdopted = this.adoptedPets.length;
        this.recentAdoptedPets = this.adoptedPets.slice(0, 5);
        this.todayAdoptions = Math.min(12, this.adoptedPets.length); 
      },
      error: (error) => {
        console.error('Erro ao carregar pets adotados:', error);
        this.todayAdoptions = 12; 
      }
    });

    this.petService.getPetsByStatus(PetStatus.AVAILABLE).subscribe({
      next: (pets) => {
        this.availablePets = pets.slice(0, 6); 
        this.totalPetsAvailable = pets.length;
      },
      error: (error) => {
        console.error('Erro ao carregar pets disponíveis:', error);
        this.totalPetsAvailable = 30; 
      }
    });
  }

  private loadInventoryStats(): void {
    this.storeService.getInventoryStats().subscribe({
      next: (stats) => {
        if (stats.available > 0) {
          this.totalPetsAvailable = stats.available;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas do inventário:', error);
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

  }

  onImageError = (event: Event): void => this.imageService.handleImageError(event);

  getPetImage(pet: Pet): string {
    return this.imageService.getPetImage(pet, 'small');
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
}