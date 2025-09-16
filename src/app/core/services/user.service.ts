import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  LoginRequest, 
  LoginResponse, 
  ApiResponse, 
  UserProfile 
} from '../models/user.model';

import { API_ENDPOINTS, STORAGE_KEYS, HTTP_HEADERS } from '../constants/api.constants';
import { UserValidators } from '../validators/user.validators';
import { ErrorHandlerUtil } from '../utils/error-handler.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createUser(userData: CreateUserRequest): Observable<User> {
    UserValidators.validateCreateUserRequest(userData);
    
    return this.http.post<User>(`${this.apiUrl}${API_ENDPOINTS.REGISTER}`, userData, {
      headers: HTTP_HEADERS.JSON
    }).pipe(
      map(response => this.mapToUser(response)),
      catchError(error => ErrorHandlerUtil.handleCreateUserError(error))
    );
  }

  createUsersWithArray(users: CreateUserRequest[]): Observable<User[]> {
    UserValidators.validateUserArray(users);
    
    return this.http.post<User[]>(`${this.apiUrl}${API_ENDPOINTS.CREATE_WITH_ARRAY}`, users, {
      headers: HTTP_HEADERS.JSON
    }).pipe(
      map(response => response.map(user => this.mapToUser(user))),
      catchError(error => ErrorHandlerUtil.handleBulkCreateError(error))
    );
  }

  createUsersWithList(users: CreateUserRequest[]): Observable<User[]> {
    UserValidators.validateUserArray(users);
    
    return this.http.post<User[]>(`${this.apiUrl}${API_ENDPOINTS.CREATE_WITH_LIST}`, users, {
      headers: HTTP_HEADERS.JSON
    }).pipe(
      map(response => response.map(user => this.mapToUser(user))),
      catchError(error => ErrorHandlerUtil.handleBulkCreateError(error))
    );
  }

  getUserByUsername(username: string): Observable<User> {
    UserValidators.validateUsername(username);
    
    return this.http.get<User>(`${this.apiUrl}${API_ENDPOINTS.USERS}/${username}`).pipe(
      map(response => this.mapToUser(response)),
      catchError(error => ErrorHandlerUtil.handleGetUserError(error))
    );
  }

  updateUser(username: string, userData: UpdateUserRequest): Observable<User> {
    UserValidators.validateUsername(username);
    UserValidators.validateUpdateUserRequest(userData);
    
    return this.http.put<User>(`${this.apiUrl}${API_ENDPOINTS.USERS}/${username}`, userData, {
      headers: HTTP_HEADERS.JSON
    }).pipe(
      map(response => this.mapToUser(response)),
      catchError(error => ErrorHandlerUtil.handleUpdateUserError(error))
    );
  }

  deleteUser(username: string): Observable<ApiResponse<null>> {
    UserValidators.validateUsername(username);
    
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}${API_ENDPOINTS.USERS}/${username}`).pipe(
      catchError(error => ErrorHandlerUtil.handleDeleteUserError(error))
    );
  }

  loginUser(username: string, password: string): Observable<LoginResponse> {
    UserValidators.validateLoginCredentials(username, password);
    
    const loginData: LoginRequest = { username, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}${API_ENDPOINTS.LOGIN}`, loginData, {
      headers: HTTP_HEADERS.JSON
    }).pipe(
      catchError(error => ErrorHandlerUtil.handleLoginError(error))
    );
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    const token = this.getStoredToken();
    if (!token) {
      return throwError(() => new Error('Token de acesso não encontrado'));
    }

    return this.http.get<UserProfile>(`${this.apiUrl}${API_ENDPOINTS.PROFILE}`, {
      headers: HTTP_HEADERS.AUTH(token)
    }).pipe(
      catchError(error => ErrorHandlerUtil.handleGetProfileError(error))
    );
  }

  logoutUser(): Observable<ApiResponse<null>> {
    return this.http.get<ApiResponse<null>>(`${this.apiUrl}${API_ENDPOINTS.LOGOUT}`).pipe(
      catchError(error => ErrorHandlerUtil.handleLogoutError(error))
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      created_at: data.created_at
    };
  }
}