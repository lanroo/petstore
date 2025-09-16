import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { 
  Pet, 
  PetResponse, 
  PetStats, 
  PetFilters, 
  PetUploadResponse, 
  PetAdoptionRequest 
} from '../models/pet.model';

import { PET_API_ENDPOINTS, PET_DEFAULTS, PET_ERROR_MESSAGES } from '../constants/pet.constants';

import { PetValidators } from '../validators/pet.validators';
  
import { ErrorHandlerUtil } from '../utils/error-handler.util';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getPets(filters?: PetFilters): Observable<PetResponse> {
    if (filters) {
      PetValidators.validatePetFilters(filters);
    }
    
    const params = this.buildQueryParams(filters);
    
    return this.http.get<any>(`${this.apiUrl}${PET_API_ENDPOINTS.PETS}`, { params })
      .pipe(
        map(response => this.mapToPetResponse(response)),
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  getPetById(id: number): Observable<Pet> {
    PetValidators.validatePetId(id);
    
    return this.http.get<Pet>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_BY_ID(id)}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  createPet(pet: Omit<Pet, 'id' | 'created_at' | 'updated_at'>): Observable<Pet> {
    PetValidators.validatePetData(pet);
    
    return this.http.post<Pet>(`${this.apiUrl}${PET_API_ENDPOINTS.PETS}`, pet)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleCreateUserError(error))
      );
  }

  updatePet(id: number, pet: Partial<Pet>): Observable<Pet> {
    PetValidators.validatePetId(id);
    PetValidators.validatePetData(pet);
    
    return this.http.put<Pet>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_BY_ID(id)}`, pet)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleUpdateUserError(error))
      );
  }

  deletePet(id: number): Observable<void> {
    PetValidators.validatePetId(id);
    
    return this.http.delete<void>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_BY_ID(id)}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleDeleteUserError(error))
      );
  }

  getPetsByStatus(status: string): Observable<Pet[]> {
    return this.getPets({ status: status as any, limit: PET_DEFAULTS.LIMIT }).pipe(
      map(response => response.pets)
    );
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}${PET_API_ENDPOINTS.PET_FILTERS}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  searchPets(query: string): Observable<Pet[]> {
    PetValidators.validateSearchQuery(query);
    
    const params = new HttpParams().set('q', query);
    
    return this.http.get<{ pets: Pet[], query: string }>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_SEARCH}`, { params })
      .pipe(
        map(response => response.pets),
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  uploadPetPhotos(petId: number, files: File[]): Observable<PetUploadResponse> {
    PetValidators.validatePetId(petId);
    PetValidators.validateFileUpload(files);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return this.http.post<PetUploadResponse>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_PHOTOS(petId)}`, formData)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleCreateUserError(error))
      );
  }

  adoptPet(petId: number, userId: number): Observable<Pet> {
    PetValidators.validatePetId(petId);
    PetValidators.validateAdoptionRequest(userId);
    
    const adoptionRequest: PetAdoptionRequest = { user_id: userId };
    
    return this.http.post<Pet>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_ADOPT(petId)}`, adoptionRequest)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleCreateUserError(error))
      );
  }

  getPetStats(): Observable<PetStats> {
    return this.http.get<PetStats>(`${this.apiUrl}${PET_API_ENDPOINTS.PET_STATS}`)
      .pipe(
        catchError(error => ErrorHandlerUtil.handleGetUserError(error))
      );
  }

  private buildQueryParams(filters?: PetFilters): HttpParams {
    let params = new HttpParams();
    
    if (!filters) {
      return params.set('limit', PET_DEFAULTS.LIMIT.toString());
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
    if (filters.gender) {
      params = params.set('gender', filters.gender);
    }
    if (filters.min_age) {
      params = params.set('min_age', filters.min_age.toString());
    }
    if (filters.max_age) {
      params = params.set('max_age', filters.max_age.toString());
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.q) {
      params = params.set('q', filters.q);
    }
    
    const limit = filters.limit || PET_DEFAULTS.LIMIT;
    params = params.set('limit', limit.toString());
    
    return params;
  }

  private mapToPetResponse(response: any): PetResponse {
    if (Array.isArray(response)) {
      return {
        pets: response,
        total: response.length,
        page: PET_DEFAULTS.PAGE,
        limit: PET_DEFAULTS.LIMIT
      };
    } else if (response && response.pets && Array.isArray(response.pets)) {
      return {
        pets: response.pets,
        total: response.total || response.pets.length,
        page: response.page || PET_DEFAULTS.PAGE,
        limit: response.limit || PET_DEFAULTS.LIMIT
      };
    } else {
      return {
        pets: [],
        total: 0,
        page: PET_DEFAULTS.PAGE,
        limit: PET_DEFAULTS.LIMIT
      };
    }
  }
}