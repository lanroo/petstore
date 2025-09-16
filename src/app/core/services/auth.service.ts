import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

export interface AuthUser {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'admin';
  readonly avatar?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface LoginResult {
  readonly success: boolean;
  readonly user?: AuthUser;
  readonly message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private static readonly STORAGE_KEYS = {
    ADMIN_USER: 'admin_user',
    ACCESS_TOKEN: 'access_token'
  } as const;

  constructor(private readonly userService: UserService) {
    this.initializeAuth();
  }

  login(credentials: LoginCredentials): Observable<LoginResult> {
    if (!this.isValidCredentials(credentials)) {
      return of({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }

    const { username, password } = credentials;
    
    return this.userService.loginUser(username, password).pipe(
      switchMap(loginResponse => this.handleLoginResponse(loginResponse, username)),
      catchError(() => this.handleLoginError())
    );
  }

  logout(): void {
    this.clearUserState();
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
    return user?.role === 'admin';
  }

  updateCurrentUser(user: AuthUser): void {
    this.setCurrentUser(user);
    this.storeAuth(user);
  }

  needsProfileSetup(): boolean {
    return false;
  }


  private initializeAuth(): void {
    this.loadStoredUser();
  }

  private isValidCredentials(credentials: LoginCredentials): boolean {
    return !!(credentials.username?.trim() && credentials.password?.trim());
  }

  private handleLoginResponse(loginResponse: any, username: string): Observable<LoginResult> {
    if (!loginResponse.access_token) {
      return of({ 
        success: false, 
        message: loginResponse.message || 'Erro no login' 
      });
    }

    this.storeAccessToken(loginResponse.access_token);
    
    return this.userService.getCurrentUserProfile().pipe(
      map(userData => this.createUserFromApiData(userData, username)),
      map(user => {
        this.setCurrentUser(user);
        this.storeAuth(user);
        return { 
          success: true, 
          user, 
          message: 'Login realizado com sucesso!' 
        };
      })
    );
  }

  private handleLoginError(): Observable<LoginResult> {
    return of({ 
      success: false, 
      message: 'Erro de conexão. Verifique suas credenciais e tente novamente.' 
    });
  }

  private createUserFromApiData(userData: any, username: string): AuthUser {
    return {
      id: userData.id || this.generateUserId(),
      username,
      email: userData.email || '',
      name: userData.full_name || username,
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    };
  }

  private generateUserId(): number {
    return Math.floor(Math.random() * 1000000) + 1000;
  }

  private setCurrentUser(user: AuthUser): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearUserState(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(AuthService.STORAGE_KEYS.ADMIN_USER);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.setCurrentUser(user);
      } catch {
        this.clearStoredAuth();
      }
    }
  }

  private storeAuth(user: AuthUser): void {
    localStorage.setItem(AuthService.STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
  }

  private storeAccessToken(token: string): void {
    localStorage.setItem(AuthService.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(AuthService.STORAGE_KEYS.ADMIN_USER);
    localStorage.removeItem(AuthService.STORAGE_KEYS.ACCESS_TOKEN);
  }
}
