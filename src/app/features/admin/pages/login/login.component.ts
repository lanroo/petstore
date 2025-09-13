import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, LoginCredentials, AuthUser } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    
    const registered = this.route.snapshot.queryParams['registered'];
    const username = this.route.snapshot.queryParams['username'];
    
    if (registered === 'true') {
      this.successMessage = `Conta criada com sucesso! Você pode fazer login com o usuário: ${username}`;
    }
    
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginCredentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.user) {
            this.redirectBasedOnRole(response.user);
          } else {
            this.errorMessage = response.message || 'Erro ao fazer login';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro de conexão. Tente novamente.';
          console.error('Login error:', error);
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private redirectBasedOnRole(user?: AuthUser): void {
    const currentUser = user || this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }

    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
      return;
    }
    
    switch (currentUser.role) {
      case 'admin':
      case 'super_admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'user':
      default:
        this.router.navigate(['/user/dashboard']);
        break;
    }
  }

  goToRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/auth/register']);
  }
}
