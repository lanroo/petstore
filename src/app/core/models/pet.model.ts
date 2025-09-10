
export interface Pet {
    id?: number;
    category?: Category;
    name: string;
    photoUrls: string[];
    tags?: Tag[];
    status?: PetStatus;
  }
  
  export interface Category {
    id?: number;
    name?: string;
  }
  
  export interface Tag {
    id?: number;
    name?: string;
  }
  
  export enum PetStatus {
    AVAILABLE = 'available',
    PENDING = 'pending',
    SOLD = 'sold'
  }
  