import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Pet, PetStatus } from '../models/pet.model';
import { ApiResponse } from '../models/api-response.model';

export interface PetFilters {
  status?: PetStatus;
  category?: string;
  name?: string;
  limit?: number;
  offset?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPets(filters?: PetFilters): Observable<Pet[]> {
    let params = new HttpParams();
    
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters?.offset) {
      params = params.set('offset', filters.offset.toString());
    }

    return this.http.get<Pet[]>(`${this.apiUrl}/pet/findByStatus`, { params })
      .pipe(
        map((pets: Pet[]) => {
          if (filters?.name) {
            pets = pets.filter(pet => 
              pet.name?.toLowerCase().includes(filters.name!.toLowerCase())
            );
          }
          if (filters?.category) {
            pets = pets.filter(pet => 
              pet.category?.name?.toLowerCase().includes(filters.category!.toLowerCase())
            );
          }
          return pets;
        }),
        catchError(this.handleError)
      );
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/pet/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createPet(pet: Omit<Pet, 'id'>): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pet`, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePet(pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pet`, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePet(id: number): Observable<ApiResponse<{ id: number }>> {
    return this.http.delete<ApiResponse<{ id: number }>>(`${this.apiUrl}/pet/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPetsByStatus(status: PetStatus): Observable<Pet[]> {
    const params = new HttpParams().set('status', status);
    
    return this.http.get<Pet[]>(`${this.apiUrl}/pet/findByStatus`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  searchPetsByTags(tags: string[]): Observable<Pet[]> {
    const params = new HttpParams().set('tags', tags.join(','));
    
    return this.http.get<Pet[]>(`${this.apiUrl}/pet/findByTags`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }


  uploadPetImage(petId: number, file: File): Observable<ApiResponse<{ photoUrls?: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ApiResponse<{ photoUrls?: string[] }>>(`${this.apiUrl}/pet/${petId}/uploadImage`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePetWithFormData(petId: number, petData: { name?: string; status?: string }): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('name', petData.name || '')
      .set('status', petData.status || '');

    return this.http.post<ApiResponse>(`${this.apiUrl}/pet/${petId}`, params)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPetStats(): Observable<{
    available: number;
    pending: number;
    sold: number;
    total: number;
  }> {
    return this.getPets().pipe(
      map((pets) => {
        const stats = {
          available: 0,
          pending: 0,
          sold: 0,
          total: pets.length
        };

        pets.forEach(pet => {
          switch (pet.status) {
            case PetStatus.AVAILABLE:
              stats.available++;
              break;
            case PetStatus.PENDING:
              stats.pending++;
              break;
            case PetStatus.SOLD:
              stats.sold++;
              break;
          }
        });

        return stats;
      }),
      catchError(() => {
        return throwError(() => new Error('Erro ao carregar estatísticas dos pets'));
      })
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