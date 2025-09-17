import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingService } from '../../../../core/services/loading.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    
    authServiceSpy.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have login form', () => {
    expect(component.loginForm).toBeDefined();
  });

  it('should have email field', () => {
    expect(component.loginForm.get('email')).toBeDefined();
  });

  it('should have password field', () => {
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should have rememberMe field', () => {
    expect(component.loginForm.get('rememberMe')).toBeDefined();
  });

  it('should have onSubmit method', () => {
    expect(typeof component.onSubmit).toBe('function');
  });

  it('should have isLoading property', () => {
    expect(typeof component.isLoading).toBe('boolean');
  });
});