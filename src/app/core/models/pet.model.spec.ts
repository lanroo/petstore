import { Pet, PetStatus, PetResponse } from './pet.model';

describe('Pet Model', () => {
  it('should create Pet interface correctly', () => {
    const pet: Pet = {
      id: 1,
      name: 'Rex',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      gender: 'male',
      size: 'large',
      color: 'Dourado',
      description: 'Cachorro muito amigável',
      status: PetStatus.AVAILABLE,
      city: 'São Paulo',
      state: 'SP',
      photos: ['photo1.jpg', 'photo2.jpg'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    expect(pet.id).toBe(1);
    expect(pet.name).toBe('Rex');
    expect(pet.species).toBe('dog');
    expect(pet.status).toBe(PetStatus.AVAILABLE);
  });

  it('should have correct PetStatus enum values', () => {
    expect(PetStatus.AVAILABLE).toBe('available');
    expect(PetStatus.ADOPTED).toBe('adopted');
    expect(PetStatus.PENDING).toBe('pending');
    expect(PetStatus.UNAVAILABLE).toBe('unavailable');
  });

  it('should create PetResponse interface correctly', () => {
    const response: PetResponse = {
      pets: [],
      total: 0,
      page: 1,
      limit: 10
    };

    expect(response.pets).toEqual([]);
    expect(response.total).toBe(0);
    expect(response.page).toBe(1);
    expect(response.limit).toBe(10);
  });
});
