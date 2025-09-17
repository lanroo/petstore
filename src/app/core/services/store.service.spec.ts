import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreService } from './store.service';
import { environment } from '../../../environments/environment';
import { OrderStatus } from '../models/store.model';

describe('StoreService', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoreService]
    });
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get inventory', () => {
    const mockInventory = {
      available: 10,
      adopted: 5,
      pending: 2
    };

    service.getInventory().subscribe(inventory => {
      expect(inventory).toEqual(mockInventory);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/store/inventory`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInventory);
  });

  it('should handle get inventory error', () => {
    service.getInventory().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/store/inventory`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should place order', () => {
    const mockOrderRequest = {
      petId: 1,
      quantity: 1,
      shipDate: '2024-01-01',
      status: OrderStatus.PLACED,
      complete: false
    };

    const mockOrder = {
      id: 1,
      petId: 1,
      quantity: 1,
      shipDate: '2024-01-01',
      status: OrderStatus.PLACED,
      complete: false
    };

    service.placeOrder(mockOrderRequest).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/store/order`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockOrderRequest);
    req.flush(mockOrder);
  });

  it('should handle place order error', () => {
    const mockOrderRequest = {
      petId: 1,
      quantity: 1,
      shipDate: '2024-01-01',
      status: OrderStatus.PLACED,
      complete: false
    };

    service.placeOrder(mockOrderRequest).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/store/order`);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });
});
