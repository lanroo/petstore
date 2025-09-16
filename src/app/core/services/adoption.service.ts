import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdoptionRequest {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  petId?: number;
  petPhotos?: string[];
  petName?: string;
  petSpecies?: string;
  petBreed?: string;
  petAge?: string;
  petGender?: string;
  petSize?: string;
  petDescription?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

const MIN_NAME_LENGTH = 2;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private apiUrl = environment.apiUrl;
  private adoptionCreated$ = new Subject<any>();
  private localAdoptions: any[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalAdoptions();
  }

  get adoptionCreated(): Observable<any> {
    return this.adoptionCreated$.asObservable();
  }

  private loadLocalAdoptions(): void {
    try {
      const stored = localStorage.getItem('local_adoptions');
      this.localAdoptions = stored ? JSON.parse(stored) : [];
    } catch (error) {
      this.localAdoptions = [];
    }
  }

  private saveLocalAdoptions(): void {
    try {
      localStorage.setItem('local_adoptions', JSON.stringify(this.localAdoptions));
    } catch (error) {
     
    }
  }

  getLocalAdoptions(userId: number): any[] {
    return this.localAdoptions.filter(adoption => adoption.user_id === userId);
  }

  submitAdoptionRequest(petId: number, request: Omit<AdoptionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'petId'>, userId: number | null = null): Observable<any> {
    const adoptionData: any = {
      pet_id: petId,
      full_name: request.fullName,
      email: request.email,
      phone: request.whatsapp, 
      whatsapp: request.whatsapp,
      pet_name: request.petName,
      pet_species: request.petSpecies,
      pet_breed: request.petBreed,
      pet_age: request.petAge,
      pet_gender: request.petGender,
      pet_size: request.petSize,
      pet_description: request.petDescription
    };

    if (userId !== null) {
      adoptionData.user_id = userId;
    } else {
      adoptionData.user_id = 0;
    }

    return this.http.post<any>(`${this.apiUrl}/adoption-requests`, adoptionData)
      .pipe(
        tap(response => {
          this.adoptionCreated$.next({
            petId,
            userId,
            adoptionData: response,
            localAdoption: null
          });
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  validateAdoptionRequest(request: Partial<AdoptionRequest>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidName(request.fullName)) {
      errors.push('Nome completo é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!this.isValidEmail(request.email)) {
      errors.push('E-mail válido é obrigatório');
    }

    if (!this.isValidPhone(request.phone)) {
      errors.push('WhatsApp válido é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidName(name?: string): boolean {
    return !!(name && name.length >= MIN_NAME_LENGTH);
  }

  private isValidEmail(email?: string): boolean {
    return !!(email && EMAIL_REGEX.test(email));
  }

  private isValidPhone(phone?: string): boolean {
    return !!(phone && PHONE_REGEX.test(phone));
  }
}
