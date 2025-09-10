import { Component, HostListener, OnInit } from '@angular/core';
import { PetService } from '../../core/services/pet.service';
import { ImageService } from '../../core/services/image.service';
import { StoreService } from '../../core/services/store.service';
import { Pet, PetStatus } from '../../core/models/pet.model';

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
    this.petService.getPetsByStatus(PetStatus.SOLD).subscribe({
      next: (pets) => {
        this.adoptedPets = pets
          .filter(pet => pet.name && pet.name !== 'null')
          .map(pet => ({
            ...pet,
            photoUrls: this.getValidPhotoUrls(pet)
          }));
        this.totalPetsAdopted = this.adoptedPets.length;

        this.recentAdoptedPets = this.adoptedPets.slice(0, 5);
        this.todayAdoptions = Math.min(12, this.adoptedPets.length); 
      },
      error: (error) => {
        console.error('Erro ao carregar pets adotados:', error);
        this.todayAdoptions = 12; 
      }
    });

    this.loadRealAvailablePets();
  }

  private loadRealAvailablePets(): void {
    this.availablePets = [];
    
    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        this.imageService.getRandomDogImage().subscribe({
          next: (imageUrl) => {
            const dogPet: Pet = {
              id: i,
              name: `Cachorro ${i}`,
              category: { id: 1, name: 'Cachorro' },
              photoUrls: [imageUrl],
              tags: [
                { id: 1, name: 'Golden Retriever' },
                { id: 2, name: `${2 + i} anos` },
                { id: 3, name: 'São Paulo, SP' }
              ],
              status: PetStatus.AVAILABLE
            };
            this.availablePets.push(dogPet);
            console.log(`🐕 Cachorro ${i} adicionado:`, imageUrl);
          },
          error: (error) => {
            console.error(`Erro ao carregar imagem do cachorro ${i}:`, error);
          }
        });
      }, i * 100); 
    }

    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        this.imageService.getRandomCatImage().subscribe({
          next: (imageUrl) => {
            const catPet: Pet = {
              id: i + 3,
              name: `Gato ${i}`,
              category: { id: 2, name: 'Gato' },
              photoUrls: [imageUrl],
              tags: [
                { id: 1, name: 'Persa' },
                { id: 2, name: `${1 + i} anos` },
                { id: 3, name: 'Rio de Janeiro, RJ' }
              ],
              status: PetStatus.AVAILABLE
            };
            this.availablePets.push(catPet);
            console.log(`🐱 Gato ${i} adicionado:`, imageUrl);
          },
          error: (error) => {
            console.error(`Erro ao carregar imagem do gato ${i}:`, error);
          }
        });
      }, (i + 3) * 100); 
    }

    this.totalPetsAvailable = this.availablePets.length;
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

  private getValidPhotoUrls(pet: Pet): string[] {
    if (pet.photoUrls && pet.photoUrls.length > 0 && pet.photoUrls[0]) {
      return pet.photoUrls;
    }
    
    return [`https://picsum.photos/200/200?random=${pet.id}`];
  }

  getPetType(pet: Pet): string {
    if (pet.category?.name) {
      return pet.category.name;
    }
    
    if (pet.name) {
      const name = pet.name.toLowerCase();
      if (name.includes('dog') || name.includes('cachorro')) return 'Cachorro';
      if (name.includes('cat') || name.includes('gato')) return 'Gato';
    }
    
    return ((pet.id || 1) % 2 === 0) ? 'Cachorro' : 'Gato';
  }

  getPetAge(pet: Pet): string {
    if (pet.tags && pet.tags.length > 0) {
      const ageTag = pet.tags.find(tag => tag.name?.includes('anos') || tag.name?.includes('meses'));
      if (ageTag?.name) {
        return ageTag.name;
      }
    }
    
    const age = ((pet.id || 1) % 5) + 1;
    return `${age} anos`;
  }

  getPetLocation(pet: Pet): string {
    if (pet.tags && pet.tags.length > 0) {
      const locationTag = pet.tags.find(tag => 
        tag.name?.includes('SP') || 
        tag.name?.includes('RJ') || 
        tag.name?.includes('MG') ||
        tag.name?.includes('BA') ||
        tag.name?.includes('DF') ||
        tag.name?.includes('CE') ||
        tag.name?.includes('PE') ||
        tag.name?.includes('RS')
      );
      if (locationTag?.name) {
        return locationTag.name;
      }
    }
    
    const cities = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA'];
    return cities[((pet.id || 1) % cities.length)];
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 1000);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollIndicator = scrollTop < 100;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {

  }
}