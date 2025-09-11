
export interface Pet {
  id?: number;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  description: string;
  photos: string[];
  status?: PetStatus;
  created_at?: string;
  updated_at?: string;
}

export enum PetStatus {
  AVAILABLE = 'available',
  ADOPTED = 'adopted'
}

export interface PetResponse {
  pets: Pet[];
  total: number;
  page: number;
  limit: number;
}

export interface PetStats {
  total_pets: number;
  available_pets: number;
  adopted_pets: number;
}
  