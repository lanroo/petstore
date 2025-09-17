import { TestBed } from '@angular/core/testing';
import { PetUtils } from './pet.utils';
import { PetStatus } from '../models/pet.model';

describe('PetUtils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(PetUtils).toBeTruthy();
  });

  it('should get pet type', () => {
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
    
    const result = PetUtils.getPetType(mockPet);
    expect(result).toBe('Cachorro');
  });

  it('should get pet age', () => {
    const mockPet = {
      id: 1,
      name: 'Rex',
      species: 'dog' as const,
      breed: 'Golden Retriever',
      age: 6,
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
    
    const result = PetUtils.getPetAge(mockPet);
    expect(result).toBe('6 meses');
  });

  it('should get status text', () => {
    const result = PetUtils.getStatusText('available');
    expect(result).toBe('Disponível');
  });
});
