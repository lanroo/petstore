export interface Pet {
  readonly id: number;
  readonly name: string;
  readonly species: 'dog' | 'cat';
  readonly breed: string;
  readonly age: number;
  readonly gender: 'male' | 'female';
  readonly size: 'small' | 'medium' | 'large';
  readonly color: string;
  readonly description: string;
  readonly photos: string[];
  readonly status: PetStatus;
  readonly city: string;
  readonly state: string;
  readonly created_at: string;
  readonly updated_at?: string;
}

export enum PetStatus {
  AVAILABLE = 'available',
  ADOPTED = 'adopted',
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable'
}

export interface PetResponse {
  readonly pets: Pet[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

export interface PetStats {
  readonly total_pets: number;
  readonly adopted_pets: number;
  readonly pending_adoptions: number;
  readonly available_pets: number;
}

export interface PetFilters {
  readonly species?: 'dog' | 'cat';
  readonly city?: string;
  readonly status?: PetStatus;
  readonly gender?: 'male' | 'female';
  readonly min_age?: number;
  readonly max_age?: number;
  readonly page?: number;
  readonly limit?: number;
  readonly q?: string;
}

export interface PetUploadResponse {
  readonly message: string;
  readonly pet_id: number;
  readonly uploaded_files: string[];
  readonly total_photos: number;
}

export interface PetAdoptionRequest {
  readonly user_id: number;
}