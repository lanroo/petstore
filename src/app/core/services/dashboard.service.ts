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
  readonly status: 'pending' | 'approved' | 'rejected' | 'completed';
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
  private static readonly STORAGE_KEYS = {
    ADMIN_USERS: 'admin_created_users',
    LOCAL_ADOPTIONS: 'local_adoptions'
  } as const;

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
    const localAdoptions = this.adoptionService.getLocalAdoptions(userId);
    const adoptions: AdoptionRequest[] = localAdoptions.map(adoption => 
      this.mapToAdoptionRequest(adoption)
    );

    return of(adoptions).pipe(
      catchError(() => of([]))
    );
  }

  updateAdoptionStatus(adoptionId: number, status: string): Observable<{ success: boolean; message: string }> {
    return of({ success: false, message: 'Endpoint not available' });
  }

  private mapApiStatsToDashboardStats(stats: any): DashboardStats {
    const localUsers = this.getLocalUsersCount();
    return {
      totalUsers: 2 + localUsers,
      totalPets: stats.total_pets || 0,
      totalAdoptions: stats.adopted_pets || 0,
      pendingAdoptions: stats.pending_adoptions || 0
    };
  }

  private getFallbackStats(): Observable<DashboardStats> {
    const localUsers = this.getLocalUsersCount();
    return of({
      totalUsers: 2 + localUsers,
      totalPets: 0,
      totalAdoptions: 0,
      pendingAdoptions: 0
    });
  }

  private getLocalUsersCount(): number {
    try {
      const users = localStorage.getItem(DashboardService.STORAGE_KEYS.ADMIN_USERS);
      return users ? JSON.parse(users).length : 0;
    } catch {
      return 0;
    }
  }

  private getLocalAdoptions(): AdoptionRequest[] {
    try {
      const stored = localStorage.getItem(DashboardService.STORAGE_KEYS.LOCAL_ADOPTIONS);
      const localAdoptions = stored ? JSON.parse(stored) : [];
      
      return localAdoptions.map((adoption: any) => this.mapToAdoptionRequest(adoption));
    } catch {
      return [];
    }
  }

  private processApiAdoptions(response: any, limit: number): AdoptionRequest[] {
    const apiAdoptions = Array.isArray(response) 
      ? response.map(adoption => this.mapToAdoptionRequest(adoption))
      : [];

    return this.sortAndLimitAdoptions(apiAdoptions, limit);
  }

  private getFallbackAdoptions(limit: number): Observable<AdoptionRequest[]> {
    const localAdoptions = this.getLocalAdoptions();
    return of(this.sortAndLimitAdoptions(localAdoptions, limit));
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