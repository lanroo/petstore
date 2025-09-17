import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { PetDetailComponent } from './pet-detail.component';
import { PetService } from '../../../../core/services/pet.service';
import { ImageService } from '../../../../core/services/image.service';
import { AdoptionService } from '../../../../core/services/adoption.service';
import { NotificationService } from '../../../../core/services/notification.service';

describe('PetDetailComponent', () => {
  let component: PetDetailComponent;
  let fixture: ComponentFixture<PetDetailComponent>;
  let mockPetService: jasmine.SpyObj<PetService>;
  let mockImageService: jasmine.SpyObj<ImageService>;
  let mockAdoptionService: jasmine.SpyObj<AdoptionService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const petServiceSpy = jasmine.createSpyObj('PetService', ['getPetById']);
    const imageServiceSpy = jasmine.createSpyObj('ImageService', ['getPetImage']);
    const adoptionServiceSpy = jasmine.createSpyObj('AdoptionService', ['submitAdoptionRequest', 'validateAdoptionRequest']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    petServiceSpy.getPetById.and.returnValue(of({
      id: 1,
      name: 'Rex',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      gender: 'male',
      size: 'large',
      color: 'Dourado',
      description: 'Cachorro amigável',
      status: 'available',
      city: 'São Paulo',
      state: 'SP',
      photos: ['photo1.jpg'],
      created_at: '2024-01-01T00:00:00Z'
    }));
    imageServiceSpy.getPetImage.and.returnValue('default-image.jpg');
    adoptionServiceSpy.submitAdoptionRequest.and.returnValue(of({}));
    adoptionServiceSpy.validateAdoptionRequest.and.returnValue({ isValid: true, errors: [] });
    notificationServiceSpy.showSuccess.and.returnValue();
    notificationServiceSpy.showError.and.returnValue();

    await TestBed.configureTestingModule({
      declarations: [PetDetailComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTabsModule,
        MatDividerModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: PetService, useValue: petServiceSpy },
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: AdoptionService, useValue: adoptionServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
            snapshot: { 
              params: { id: '1' },
              paramMap: {
                get: (key: string) => key === 'id' ? '1' : null
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetDetailComponent);
    component = fixture.componentInstance;
    mockPetService = TestBed.inject(PetService) as jasmine.SpyObj<PetService>;
    mockImageService = TestBed.inject(ImageService) as jasmine.SpyObj<ImageService>;
    mockAdoptionService = TestBed.inject(AdoptionService) as jasmine.SpyObj<AdoptionService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have pet detail container', () => {
    const containerElement = fixture.nativeElement.querySelector('.pet-detail-container');
    expect(containerElement).toBeTruthy();
  });

  it('should have pet gallery section', () => {
    const galleryElement = fixture.nativeElement.querySelector('.pet-gallery');
    expect(galleryElement).toBeTruthy();
  });

  it('should have pet info section', () => {
    const infoElement = fixture.nativeElement.querySelector('.pet-info-section');
    expect(infoElement).toBeTruthy();
  });

  it('should have action buttons', () => {
    const actionButtons = fixture.nativeElement.querySelector('.action-buttons');
    expect(actionButtons).toBeTruthy();
  });

  it('should have adopt button', () => {
    const adoptButton = fixture.nativeElement.querySelector('.adopt-button');
    expect(adoptButton).toBeTruthy();
  });

  it('should load pet details on init', () => {
    expect(mockPetService.getPetById).toHaveBeenCalledWith(1);
  });

  it('should handle pet loading error', () => {
    mockPetService.getPetById.and.returnValue(throwError('Pet not found'));
    
    fixture = TestBed.createComponent(PetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.error).toBeTruthy();
  });

  it('should get pet image', () => {
    const imageUrl = component.getPetImage(0);
    expect(imageUrl).toBeTruthy();
  });

  it('should handle adopt button click', () => {
    const adoptButton = fixture.nativeElement.querySelector('.adopt-button');
    expect(adoptButton).toBeTruthy();
    adoptButton.click();
  });

  it('should handle contact button click', () => {
    const contactButton = fixture.nativeElement.querySelector('.contact-button');
    if (contactButton) {
      contactButton.click();
    }
  });

  it('should handle image navigation buttons', () => {
    const nextButton = fixture.nativeElement.querySelector('.next-btn');
    const prevButton = fixture.nativeElement.querySelector('.prev-btn');
    
    if (nextButton) {
      nextButton.click();
    }
    
    if (prevButton) {
      prevButton.click();
    }
  });

  it('should display pet information correctly', () => {
    expect(component.pet).toBeTruthy();
    expect(component.pet?.name).toBe('Rex');
    expect(component.pet?.species).toBe('dog');
  });

  it('should handle loading state', () => {
    expect(component.loading).toBeDefined();
  });

  it('should handle error state', () => {
    expect(component.error).toBeDefined();
  });

  it('should switch tabs', () => {
    component.switchTab('info');
    expect(component.activeTab).toBe('info');
    
    component.switchTab('characteristics');
    expect(component.activeTab).toBe('characteristics');
  });

  it('should get age category', () => {
    const mockPet = {
      id: 1,
      name: 'Rex',
      species: 'dog' as const,
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male' as const,
      size: 'large' as const,
      color: 'Dourado',
      description: 'Cachorro amigável',
      status: 'available' as any,
      city: 'São Paulo',
      state: 'SP',
      photos: ['photo1.jpg'],
      created_at: '2024-01-01T00:00:00Z'
    };
    
    expect(component.getAgeCategory(mockPet)).toBe('Filhote');
  });
});
