import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { ErrorService } from '../services/error.service';

describe('HttpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    errorService = jasmine.createSpyObj('ErrorService', ['handleHttpError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        },
        { provide: ErrorService, useValue: errorService }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpClient).toBeTruthy();
  });

  it('should handle HTTP errors', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
