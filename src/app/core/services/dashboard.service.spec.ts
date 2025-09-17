import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../environments/environment';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get recent adoptions', () => {
    service.getRecentAdoptions().subscribe(adoptions => {
      expect(adoptions).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/adoption-requests?limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get dashboard stats', () => {
    service.getDashboardStats().subscribe(stats => {
      expect(stats).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pets/stats`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
