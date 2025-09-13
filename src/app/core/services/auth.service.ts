import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay, map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService, User as ApiUser } from './user.service';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
  isActive?: boolean;
  createdAt?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.checkStoredAuth();
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: AuthUser; message?: string }> {
    const { username, password } = credentials;
    
    return this.userService.loginUser(username, password).pipe(
      switchMap(loginResponse => {
        console.log('🔐 Login response from backend:', loginResponse);
        
        if (loginResponse.access_token) {
          localStorage.setItem('access_token', loginResponse.access_token);
          
          return this.userService.getCurrentUserProfile().pipe(
            map(userData => {
              const user: AuthUser = {
                id: userData.id || Math.floor(Math.random() * 1000),
                username: username,
                email: userData.email || '',
                name: userData.full_name || username,
                role: this.determineUserRole(username),
                isActive: true,
                createdAt: new Date()
              };
              
              this.setCurrentUser(user);
              this.storeAuth(user);
              
              return { success: true, user, message: 'Login realizado com sucesso!' };
            })
          );
        } else {
          return of({ success: false, message: loginResponse.message || 'Erro no login' });
        }
      }),
      catchError(error => {
        console.error('❌ Login failed:', error);
        return of({ 
          success: false, 
          message: 'Erro de conexão. Verifique suas credenciais e tente novamente.' 
        });
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearStoredAuth();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'super_admin';
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'super_admin';
  }


  private setCurrentUser(user: AuthUser): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.setCurrentUser(user);
      } catch (error) {
        this.clearStoredAuth();
      }
    }
  }

  private storeAuth(user: AuthUser): void {
    localStorage.setItem('admin_user', JSON.stringify(user));
  }

  private clearStoredAuth(): void {
    localStorage.removeItem('admin_user');
  }


  private determineUserRole(username: string): 'user' | 'admin' | 'super_admin' {
    
    if (username.toLowerCase().includes('admin')) {
      return 'admin';
    }
    return 'user';
  }
}
