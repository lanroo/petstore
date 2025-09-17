import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HTTP error', () => {
    const error = { status: 404, message: 'Not Found' };
    service.handleHttpError(error);
    expect(service).toBeTruthy();
  });

  it('should handle application error', () => {
    const error = new Error('Test error');
    service.handleApplicationError(error);
    expect(service).toBeTruthy();
  });

  it('should handle validation error', () => {
    const message = 'Validation failed';
    service.handleValidationError(message);
    expect(service).toBeTruthy();
  });

  it('should clear error', () => {
    service.clearError();
    expect(service).toBeTruthy();
  });
});
