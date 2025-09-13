import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id?: number;
  full_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  city?: string;
  created_at?: string;
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0
}

export interface LoginResponse {
  code?: number;
  type?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  createUsersWithArray(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/user/createWithArray`, users)
      .pipe(
        catchError(this.handleError)
      );
  }

  createUsersWithList(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/user/createWithList`, users)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(username: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${username}`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(username: string): Observable<{ message?: string }> {
    return this.http.delete<{ message?: string }>(`${this.apiUrl}/users/${username}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  loginUser(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password
    };

    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, loginData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrentUserProfile(): Observable<User> {
    const token = localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    
    return this.http.get<User>(`${this.apiUrl}/api/auth/me`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  logoutUser(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/user/logout`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Erro na operação do usuário. Tente novamente.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dados do usuário inválidos.';
          break;
        case 404:
          errorMessage = 'Usuário não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('UserService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}