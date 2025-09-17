import { LoadingService } from './loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isLoading$ observable', () => {
    expect(service.isLoading$).toBeDefined();
  });

  it('should have show method', () => {
    expect(typeof service.show).toBe('function');
  });

  it('should have hide method', () => {
    expect(typeof service.hide).toBe('function');
  });

  it('should have isLoading getter', () => {
    expect(typeof service.isLoading).toBe('boolean');
  });

  it('should show loading', () => {
    service.show();
    expect(service.isLoading).toBe(true);
  });

  it('should hide loading', () => {
    service.hide();
    expect(service.isLoading).toBe(false);
  });

  it('should toggle loading state', () => {
    expect(service.isLoading).toBe(false);
    service.show();
    expect(service.isLoading).toBe(true);
    service.hide();
    expect(service.isLoading).toBe(false);
  });
});