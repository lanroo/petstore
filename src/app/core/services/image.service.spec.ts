import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { PetStatus } from '../models/pet.model';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get default image', () => {
    const defaultImage = service.getDefaultImage();
    expect(defaultImage).toBeTruthy();
  });

  it('should get pet image', () => {
    const mockPet = {
      id: 1,
      name: 'Rex',
      species: 'dog' as const,
      breed: 'Golden Retriever',
      age: 2,
      gender: 'male' as const,
      size: 'large' as const,
      color: 'Dourado',
      description: 'Cachorro amigável',
      status: PetStatus.AVAILABLE,
      city: 'São Paulo',
      state: 'SP',
      photos: ['photo1.jpg'],
      created_at: '2024-01-01T00:00:00Z'
    };
    
    const imageUrl = service.getPetImage(mockPet);
    expect(imageUrl).toBeTruthy();
  });
});
