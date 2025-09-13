import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalUsers: number;
  totalPets: number;
  totalAdoptions: number;
  pendingAdoptions: number;
}

export interface AdoptionRequest {
  id: number;
  user_id: number;
  pet_id: number;
  full_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at?: string;
  pet?: {
    id: number;
    name: string;
    species: string;
    breed: string;
  };
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/pets/stats`).pipe(
      map(stats => ({
        totalUsers: 0, 
        totalPets: stats.total_pets || 0,
        totalAdoptions: stats.adopted_pets || 0,
        pendingAdoptions: 0 
      })),
      catchError(error => {
        console.error('❌ Error fetching dashboard stats:', error);
        return of({
          totalUsers: 0,
          totalPets: 0,
          totalAdoptions: 0,
          pendingAdoptions: 0
        });
      })
    );
  }

  getRecentAdoptions(limit: number = 10): Observable<AdoptionRequest[]> {
    return of([]);
  }

  getUserAdoptions(userId: number): Observable<AdoptionRequest[]> {
    return of([]);
  }

  updateAdoptionStatus(adoptionId: number, status: string): Observable<any> {
    return of({ success: false, message: 'Endpoint not available' });
  }
}
