import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['loginUser', 'getCurrentUserProfile']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isAuthenticated when not logged in', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should return false for isAdmin when not logged in', () => {
    expect(service.isAdmin()).toBe(false);
  });

         it('should return null for getCurrentUser when not logged in', () => {
           expect(service.getCurrentUser()).toBeNull();
         });
       });

