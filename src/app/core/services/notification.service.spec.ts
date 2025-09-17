import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);
    service = new NotificationService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have showSuccess method', () => {
    expect(typeof service.showSuccess).toBe('function');
  });

  it('should have showError method', () => {
    expect(typeof service.showError).toBe('function');
  });

  it('should have showWarning method', () => {
    expect(typeof service.showWarning).toBe('function');
  });

  it('should have showInfo method', () => {
    expect(typeof service.showInfo).toBe('function');
  });
});