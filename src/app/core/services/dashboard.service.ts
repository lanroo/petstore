import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AdoptionService } from './adoption.service';

export interface DashboardStats {
  readonly totalUsers: number;
  readonly totalPets: number;
  readonly totalAdoptions: number;
  readonly pendingAdoptions: number;
}

export interface PetInfo {
  readonly id: number;
  readonly name: string;
  readonly species: string;
  readonly breed: string;
  readonly photos?: string[];
  readonly age?: string;
  readonly gender?: string;
  readonly size?: string;
  readonly description?: string;
  readonly needsFullData?: boolean;
}

export interface UserInfo {
  readonly id: number;
  readonly full_name: string;
  readonly email: string;
}

export interface AdoptionRequest {
  readonly id: number;
  readonly user_id: number;
  readonly pet_id: number;
  readonly full_name: string;
  readonly email: string;
  readonly phone: string;
  readonly whatsapp?: string;
  readonly status: 'pending' | 'approved' | 'rejected' | 'completed' | 'PENDENTE' | 'APROVADA' | 'REJEITADA';
  readonly created_at: string;
  readonly updated_at?: string;
  readonly pet?: PetInfo;
  readonly user?: UserInfo;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;

  private static readonly DEFAULT_STATS: DashboardStats = {
    totalUsers: 0,
    totalPets: 0,
    totalAdoptions: 0,
    pendingAdoptions: 0
  };

  constructor(
    private readonly http: HttpClient,
    private readonly adoptionService: AdoptionService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/pets/stats`).pipe(
      map(stats => this.mapApiStatsToDashboardStats(stats)),
      catchError(() => this.getFallbackStats())
    );
  }

  getRecentAdoptions(limit: number = 10): Observable<AdoptionRequest[]> {
    return this.http.get<any>(`${this.apiUrl}/adoption-requests?limit=${limit}`).pipe(
      map(response => this.processApiAdoptions(response, limit)),
      catchError(() => this.getFallbackAdoptions(limit))
    );
  }

  getUserAdoptions(userId: number): Observable<AdoptionRequest[]> {
    return this.http.get<any>(`${this.apiUrl}/adoption-requests/user/${userId}`).pipe(
      map(response => this.processApiAdoptions(response, 50)),
      catchError(() => of([]))
    );
  }

  updateAdoptionStatus(adoptionId: number, status: string): Observable<{ success: boolean; message: string }> {
    return this.http.put<any>(`${this.apiUrl}/adoption-requests/${adoptionId}/status`, { status }).pipe(
      map(() => ({ success: true, message: 'Status updated successfully' })),
      catchError(() => of({ success: false, message: 'Failed to update status' }))
    );
  }

  private mapApiStatsToDashboardStats(stats: any): DashboardStats {
    return {
      totalUsers: stats.total_users || 0,
      totalPets: stats.total_pets || 0,
      totalAdoptions: stats.adopted_pets || 0,
      pendingAdoptions: stats.pending_adoptions || 0
    };
  }

  private getFallbackStats(): Observable<DashboardStats> {
    return of(DashboardService.DEFAULT_STATS);
  }

  private processApiAdoptions(response: any, limit: number): AdoptionRequest[] {
    const apiAdoptions = Array.isArray(response) 
      ? response.map(adoption => this.mapToAdoptionRequest(adoption))
      : [];

    return this.sortAndLimitAdoptions(apiAdoptions, limit);
  }

  private getFallbackAdoptions(limit: number): Observable<AdoptionRequest[]> {
    return of([]);
  }

  private sortAndLimitAdoptions(adoptions: AdoptionRequest[], limit: number): AdoptionRequest[] {
    return adoptions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  private mapToAdoptionRequest(adoption: any): AdoptionRequest {
    return {
      id: adoption.id,
      user_id: adoption.user_id,
      pet_id: adoption.pet_id,
      full_name: adoption.full_name,
      email: adoption.email,
      phone: adoption.phone,
      whatsapp: adoption.whatsapp,
      status: adoption.status || 'pending',
      created_at: adoption.created_at,
      updated_at: adoption.updated_at,
      pet: this.mapToPetInfo(adoption.pet, adoption.pet_id),
      user: adoption.user
    };
  }

  private mapToPetInfo(pet: any, petId: number): PetInfo {
    return {
      id: pet?.id || petId,
      name: pet?.name || `Pet ${petId}`,
      species: pet?.species || 'Não informado',
      breed: pet?.breed || 'SRD',
      photos: pet?.photos || [],
      age: pet?.age,
      gender: pet?.gender,
      size: pet?.size,
      description: pet?.description,
      needsFullData: !pet?.photos || pet.photos.length === 0
    };
  }
}