import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdoptionService } from './adoption.service';
import { environment } from '../../../environments/environment';

describe('AdoptionService', () => {
  let service: AdoptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdoptionService]
    });
    service = TestBed.inject(AdoptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate adoption request', () => {
    const validRequest = {
      fullName: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      petId: 1
    };

    const result = service.validateAdoptionRequest(validRequest);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should invalidate adoption request with missing fields', () => {
    const invalidRequest = {
      fullName: '',
      email: 'invalid-email',
      phone: '',
      petId: 0
    };

    const result = service.validateAdoptionRequest(invalidRequest);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate email format correctly', () => {
    const validEmailRequest = {
      fullName: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      petId: 1
    };

    const invalidEmailRequest = {
      fullName: 'João Silva',
      email: 'email-invalido',
      phone: '(11) 99999-9999',
      petId: 1
    };

    const validResult = service.validateAdoptionRequest(validEmailRequest);
    const invalidResult = service.validateAdoptionRequest(invalidEmailRequest);

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain('E-mail válido é obrigatório');
  });

  it('should validate phone format correctly', () => {
    const validPhoneRequest = {
      fullName: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      petId: 1
    };

    const invalidPhoneRequest = {
      fullName: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      petId: 1
    };

    const validResult = service.validateAdoptionRequest(validPhoneRequest);
    const invalidResult = service.validateAdoptionRequest(invalidPhoneRequest);

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain('WhatsApp válido é obrigatório');
  });

         it('should validate name length correctly', () => {
           const shortNameRequest = {
             fullName: 'A',
             email: 'joao@email.com',
             phone: '(11) 99999-9999',
             petId: 1
           };

           const validNameRequest = {
             fullName: 'João Silva',
             email: 'joao@email.com',
             phone: '(11) 99999-9999',
             petId: 1
           };

           const shortResult = service.validateAdoptionRequest(shortNameRequest);
           const validResult = service.validateAdoptionRequest(validNameRequest);

           expect(shortResult.isValid).toBe(false);
           expect(validResult.isValid).toBe(true);
           expect(shortResult.errors).toContain('Nome completo é obrigatório e deve ter pelo menos 2 caracteres');
         });
       });

