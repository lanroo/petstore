import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { PetFormComponent } from './pet-form.component';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatStepperModule,
        MatChipsModule,
        MatTooltipModule,
        MatDialogModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have pet form', () => {
    const formElement = fixture.nativeElement.querySelector('form');
    expect(formElement).toBeTruthy();
  });

  it('should have name input field', () => {
    const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
    expect(nameInput).toBeTruthy();
  });

  it('should have species select field', () => {
    const speciesField = fixture.nativeElement.querySelector('[formControlName="species"]');
    expect(speciesField).toBeTruthy();
  });

  it('should have breed input field', () => {
    const breedInput = fixture.nativeElement.querySelector('input[formControlName="breed"]');
    expect(breedInput).toBeTruthy();
  });

  it('should have submit button', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('should have form validation', () => {
    const form = component.petForm;
    expect(form).toBeTruthy();
    expect(form.get('name')).toBeTruthy();
    expect(form.get('species')).toBeTruthy();
    expect(form.get('breed')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.petForm;
    form.patchValue({ name: '', species: '', breed: '' });
    
    expect(form.get('name')?.hasError('required')).toBeTruthy();
    expect(form.get('species')?.hasError('required')).toBeTruthy();
    expect(form.get('breed')?.hasError('required')).toBeTruthy();
  });

  it('should be valid when all required fields are filled', () => {
    const form = component.petForm;
    form.patchValue({
      name: 'Rex',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      gender: 'male',
      size: 'large',
      color: 'Dourado',
      description: 'Cachorro amigável',
      city: 'São Paulo',
      state: 'SP'
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should handle form submission', () => {
    const form = component.petForm;
    form.patchValue({
      name: 'Rex',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      gender: 'male',
      size: 'large',
      color: 'Dourado',
      description: 'Cachorro amigável',
      city: 'São Paulo',
      state: 'SP'
    });

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
    submitButton.click();
  });

  it('should reset form when resetForm is called', () => {
    const form = component.petForm;
    form.patchValue({
      name: 'Rex',
      species: 'dog',
      breed: 'Golden Retriever'
    });

    expect(form.get('name')?.value).toBe('Rex');
    
    form.reset();
    
    expect(form.get('name')?.value).toBeNull();
    expect(form.get('species')?.value).toBeNull();
  });

  it('should handle different species options', () => {
    const form = component.petForm;
    
    // Test dog
    form.patchValue({ species: 'dog' });
    expect(form.get('species')?.value).toBe('dog');
    
    // Test cat
    form.patchValue({ species: 'cat' });
    expect(form.get('species')?.value).toBe('cat');
  });

  it('should handle different gender options', () => {
    const form = component.petForm;
    
    // Test male
    form.patchValue({ gender: 'male' });
    expect(form.get('gender')?.value).toBe('male');
    
    // Test female
    form.patchValue({ gender: 'female' });
    expect(form.get('gender')?.value).toBe('female');
  });

  it('should handle form field changes', () => {
    const form = component.petForm;
    
    // Test name field
    form.patchValue({ name: 'Test Pet' });
    expect(form.get('name')?.value).toBe('Test Pet');
    
    // Test breed field
    form.patchValue({ breed: 'Test Breed' });
    expect(form.get('breed')?.value).toBe('Test Breed');
    
    // Test age field
    form.patchValue({ age: 3 });
    expect(form.get('age')?.value).toBe(3);
  });
});
