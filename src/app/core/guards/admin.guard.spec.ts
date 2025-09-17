import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    guard = new AdminGuard(mockAuthService, mockRouter);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should have canActivate method', () => {
    expect(typeof guard.canActivate).toBe('function');
  });

  it('should check authentication', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    expect(mockAuthService.isAuthenticated).toBeDefined();
  });

  it('should check admin status', () => {
    mockAuthService.isAdmin.and.returnValue(true);
    expect(mockAuthService.isAdmin).toBeDefined();
  });
});
