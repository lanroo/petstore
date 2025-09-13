import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdoptionRequest {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  petId?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

// Constants for validation
const MIN_NAME_LENGTH = 2;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitAdoptionRequest(petId: number, request: Omit<AdoptionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'petId'>): Observable<any> {
    const adoptionData = {
      pet_id: petId,
      full_name: request.fullName,
      email: request.email,
      phone: request.phone,
      whatsapp: request.whatsapp
    };

    return this.http.post<any>(`${this.apiUrl}/pets/${petId}/adopt`, adoptionData)
      .pipe(
        catchError(error => {
          console.error('❌ Error submitting adoption request:', error);
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
