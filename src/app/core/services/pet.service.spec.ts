import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetService } from './pet.service';
import { Pet, PetStatus, PetResponse } from '../models/pet.model';
import { environment } from '../../../environments/environment';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;

  const mockPet: Pet = {
    id: 1,
    name: 'Rex',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'male',
    size: 'large',
    color: 'Dourado',
    description: 'Cachorro muito amigável',
    status: PetStatus.AVAILABLE,
    city: 'São Paulo',
    state: 'SP',
    photos: ['photo1.jpg', 'photo2.jpg'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService]
    });
    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPets', () => {
    it('should return pets response', () => {
      const mockResponse: PetResponse = {
        pets: [mockPet],
        total: 1,
        page: 1,
        limit: 10
      };
      
      service.getPets().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pets?limit=100`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when getting pets', () => {
      service.getPets().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pets?limit=100`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getPetById', () => {
    it('should return pet by id', () => {
      service.getPetById(1).subscribe(pet => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pets/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPet);
    });

    it('should handle error when getting pet by id', () => {
      service.getPetById(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pets/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPetStats', () => {
    it('should return pet statistics', () => {
      const mockStats = {
        total_pets: 10,
        adopted_pets: 5,
        pending_adoptions: 2,
        available_pets: 3
      };

      service.getPetStats().subscribe(stats => {
        expect(stats).toEqual(mockStats);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pets/stats`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });

         it('should handle error when getting pet stats', () => {
           service.getPetStats().subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/stats`);
           req.flush('Error', { status: 500, statusText: 'Server Error' });
         });
       });

       describe('createPet', () => {
         it('should create pet successfully', () => {
           const newPet = {
             name: 'Buddy',
             species: 'dog' as const,
             breed: 'Labrador',
             age: 3,
             gender: 'male' as const,
             size: 'large' as const,
             color: 'Black',
             description: 'Friendly dog',
             photos: ['photo1.jpg'],
             status: PetStatus.AVAILABLE,
             city: 'São Paulo',
             state: 'SP'
           };

           service.createPet(newPet).subscribe(pet => {
             expect(pet).toEqual(mockPet);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets`);
           expect(req.request.method).toBe('POST');
           expect(req.request.body).toEqual(newPet);
           req.flush(mockPet);
         });

         it('should handle error when creating pet', () => {
           const newPet = {
             name: 'Buddy',
             species: 'dog' as const,
             breed: 'Labrador',
             age: 3,
             gender: 'male' as const,
             size: 'large' as const,
             color: 'Black',
             description: 'Friendly dog',
             photos: ['photo1.jpg'],
             status: PetStatus.AVAILABLE,
             city: 'São Paulo',
             state: 'SP'
           };

           service.createPet(newPet).subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets`);
           req.flush('Error', { status: 400, statusText: 'Bad Request' });
         });
       });

       describe('updatePet', () => {
         it('should update pet successfully', () => {
           const updateData = { name: 'Updated Buddy' };

           service.updatePet(1, updateData).subscribe(pet => {
             expect(pet).toEqual(mockPet);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1`);
           expect(req.request.method).toBe('PUT');
           expect(req.request.body).toEqual(updateData);
           req.flush(mockPet);
         });

         it('should handle error when updating pet', () => {
           const updateData = { name: 'Updated Buddy' };

           service.updatePet(1, updateData).subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1`);
           req.flush('Error', { status: 404, statusText: 'Not Found' });
         });
       });

       describe('deletePet', () => {
         it('should delete pet successfully', () => {
           service.deletePet(1).subscribe(() => {
             expect(true).toBe(true);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1`);
           expect(req.request.method).toBe('DELETE');
           req.flush(null);
         });

         it('should handle error when deleting pet', () => {
           service.deletePet(1).subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1`);
           req.flush('Error', { status: 404, statusText: 'Not Found' });
         });
       });

       describe('getPetsByStatus', () => {
         it('should get pets by status', () => {
           const mockResponse: PetResponse = {
             pets: [mockPet],
             total: 1,
             page: 1,
             limit: 10
           };

           service.getPetsByStatus('available').subscribe(pets => {
             expect(pets).toEqual([mockPet]);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets?status=available&limit=100`);
           expect(req.request.method).toBe('GET');
           req.flush(mockResponse);
         });
       });

       describe('getFilterOptions', () => {
         it('should get filter options', () => {
           const mockOptions = {
             species: ['dog', 'cat'],
             cities: ['São Paulo', 'Rio de Janeiro']
           };

           service.getFilterOptions().subscribe(options => {
             expect(options).toEqual(mockOptions);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/filters`);
           expect(req.request.method).toBe('GET');
           req.flush(mockOptions);
         });

         it('should handle error when getting filter options', () => {
           service.getFilterOptions().subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/filters`);
           req.flush('Error', { status: 500, statusText: 'Server Error' });
         });
       });

       describe('searchPets', () => {
         it('should search pets', () => {
           const mockSearchResponse = {
             pets: [mockPet],
             query: 'buddy'
           };

           service.searchPets('buddy').subscribe(pets => {
             expect(pets).toEqual([mockPet]);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/search?q=buddy`);
           expect(req.request.method).toBe('GET');
           req.flush(mockSearchResponse);
         });

         it('should handle error when searching pets', () => {
           service.searchPets('buddy').subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/search?q=buddy`);
           req.flush('Error', { status: 500, statusText: 'Server Error' });
         });
       });

       describe('uploadPetPhotos', () => {
         it('should upload pet photos', () => {
           const mockFiles = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];
           const mockResponse = {
             success: true,
             photos: ['photo1.jpg', 'photo2.jpg']
           } as any;

           service.uploadPetPhotos(1, mockFiles).subscribe(response => {
             expect(response).toEqual(mockResponse);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1/photos`);
           expect(req.request.method).toBe('POST');
           expect(req.request.body instanceof FormData).toBe(true);
           req.flush(mockResponse);
         });

         it('should handle error when uploading photos', () => {
           const mockFiles = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];

           service.uploadPetPhotos(1, mockFiles).subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1/photos`);
           req.flush('Error', { status: 400, statusText: 'Bad Request' });
         });
       });

       describe('adoptPet', () => {
         it('should adopt pet', () => {
           service.adoptPet(1, 123).subscribe(pet => {
             expect(pet).toEqual(mockPet);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1/adopt`);
           expect(req.request.method).toBe('POST');
           expect(req.request.body).toEqual({ user_id: 123 });
           req.flush(mockPet);
         });

         it('should handle error when adopting pet', () => {
           service.adoptPet(1, 123).subscribe({
             next: () => fail('should have failed'),
             error: (error) => {
               expect(error).toBeTruthy();
             }
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets/1/adopt`);
           req.flush('Error', { status: 400, statusText: 'Bad Request' });
         });
       });

       describe('buildQueryParams', () => {
         it('should build params with filters', () => {
           const filters = {
             species: 'dog' as const,
             city: 'São Paulo',
             status: PetStatus.AVAILABLE,
             page: 1,
             limit: 20
           };

           service.getPets(filters).subscribe();

           const req = httpMock.expectOne(`${environment.apiUrl}/pets?species=dog&city=S%C3%A3o+Paulo&status=available&page=1&limit=20`);
           expect(req.request.method).toBe('GET');
           req.flush({ pets: [mockPet], total: 1, page: 1, limit: 20 });
         });

         it('should build params without filters', () => {
           service.getPets().subscribe();

           const req = httpMock.expectOne(`${environment.apiUrl}/pets?limit=100`);
           expect(req.request.method).toBe('GET');
           req.flush({ pets: [mockPet], total: 1, page: 1, limit: 100 });
         });
       });

       describe('mapToPetResponse', () => {
         it('should map array response', () => {
           service.getPets().subscribe(response => {
             expect(response.pets).toEqual([mockPet]);
             expect(response.total).toBe(1);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets?limit=100`);
           req.flush([mockPet]);
         });

         it('should map object response with pets array', () => {
           const mockResponse = {
             pets: [mockPet],
             total: 1,
             page: 1,
             limit: 10
           };

           service.getPets().subscribe(response => {
             expect(response).toEqual(mockResponse);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets?limit=100`);
           req.flush(mockResponse);
         });

         it('should map empty response', () => {
           service.getPets().subscribe(response => {
             expect(response.pets).toEqual([]);
             expect(response.total).toBe(0);
           });

           const req = httpMock.expectOne(`${environment.apiUrl}/pets?limit=100`);
           req.flush({});
         });
       });
     });
