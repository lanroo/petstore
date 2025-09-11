import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Pet, PetStatus, PetResponse, PetStats } from '../models/pet.model';

export interface PetFilters {
  species?: 'dog' | 'cat';
  city?: string;
  status?: PetStatus;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly apiUrl = 'https://projeto-jornadadados-pet-api-adoptt.zjnxkg.easypanel.host';
  private readonly defaultLimit = 100;

  constructor(private http: HttpClient) {}

  getPets(filters?: PetFilters): Observable<PetResponse> {
    const params = this.buildQueryParams(filters);
    
    return this.http.get<PetResponse>(`${this.apiUrl}/pets`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private buildQueryParams(filters?: PetFilters): HttpParams {
    let params = new HttpParams();
    
    if (!filters) {
      return params.set('limit', this.defaultLimit.toString());
    }
    
    if (filters.species) {
      params = params.set('species', filters.species);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    
    const limit = filters.limit || this.defaultLimit;
    params = params.set('limit', limit.toString());
    
    return params;
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/pets/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createPet(pet: Omit<Pet, 'id' | 'created_at' | 'updated_at'>): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets`, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePet(id: number, pet: Partial<Pet>): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pets/${id}`, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pets/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPetsByStatus(status: PetStatus): Observable<Pet[]> {
    return this.getPets({ status, limit: 100 }).pipe(
      map(response => response.pets)
    );
  }

  searchPets(query: string): Observable<Pet[]> {
    const params = new HttpParams().set('q', query);
    
    return this.http.get<{ pets: Pet[], query: string }>(`${this.apiUrl}/pets/search`, { params })
      .pipe(
        map(response => response.pets),
        catchError(this.handleError)
      );
  }

  uploadPetPhotos(petId: number, files: File[]): Observable<{
    message: string;
    pet_id: number;
    uploaded_files: string[];
    total_photos: number;
  }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return this.http.post<{
      message: string;
      pet_id: number;
      uploaded_files: string[];
      total_photos: number;
    }>(`${this.apiUrl}/pets/${petId}/photos`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  adoptPet(petId: number, userId: number): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets/${petId}/adopt`, { user_id: userId })
      .pipe(
        catchError(this.handleError)
      );
  }

  getPetStats(): Observable<PetStats> {
    return this.http.get<PetStats>(`${this.apiUrl}/pets/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Algo deu errado. Tente novamente.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique as informações.';
          break;
        case 404:
          errorMessage = 'Pet não encontrado.';
          break;
        case 405:
          errorMessage = 'Operação não permitida.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    
    console.error('PetService Error:', error);
    return throwError(() => new Error(errorMessage));
  }

}