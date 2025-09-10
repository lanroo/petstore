import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../../../core/services/pet.service';
import { ImageService } from '../../../../core/services/image.service';
import { Pet, PetStatus } from '../../../../core/models/pet.model';
import { PetUtils } from '../../../../core/utils/pet.utils';

@Component({
  selector: 'app-pet-detail',
  standalone: false,
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.scss'
})
export class PetDetailComponent implements OnInit {
  pets: Pet[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private petService: PetService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  private loadPets(): void {
    this.loading = true;
    this.error = null;

    this.petService.getPetsByStatus(PetStatus.AVAILABLE).subscribe({
      next: (pets) => {
        this.pets = pets
          .slice(0, 10)
          .map(pet => ({
            ...pet,
            photoUrls: this.imageService.getValidPhotoUrls(pet, 'large')
          }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pets:', error);
        this.error = 'Erro ao carregar pets';
        this.loading = false;
      }
    });
  }

  getPetType = PetUtils.getPetType;
  getPetAge = PetUtils.getPetAge;
  getPetLocation = PetUtils.getPetLocation;
  getPetBreed = PetUtils.getPetBreed;
  getStatusText = PetUtils.getStatusText;
  getStatusColor = PetUtils.getStatusColor;
  onImageError = (event: Event): void => this.imageService.handleImageError(event);

  goBack(): void {
    this.router.navigate(['/pets']);
  }

  viewPet(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/pets', id]);
  }

  getPetImage(pet: Pet): string {
    return this.imageService.getPetImage(pet, 'small');
  }
}