import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService, AdoptionRequest } from '../../../../core/services/adoption.service';
import { PetService } from '../../../../core/services/pet.service';
import { Pet } from '../../../../core/models/pet.model';
import { AuthService } from '../../../../core/services/auth.service';

interface SimpleAdoptionFormData {
  fullName: string;
  whatsapp: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule]
})
export class AdoptionComponent implements OnInit {
  adoptionForm: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;
  petId: number | null = null;
  pet: Pet | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adoptionService: AdoptionService,
    private petService: PetService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.adoptionForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.petId = params['petId'] ? +params['petId'] : null;
      if (this.petId) {
        this.loadPetDetails();
      }
    });
    
    this.adoptionForm.get('whatsapp')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        this.formatPhoneNumber(value, 'whatsapp');
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private loadPetDetails(): void {
    if (!this.petId) {
      return;
    }
    
    this.isLoading = true;
    this.petService.getPetById(this.petId).subscribe({
      next: (pet) => {
        this.pet = pet;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/pets/adoption']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adoptionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.adoptionForm.valid && this.petId) {
      this.isSubmitting = true;
      
      const formData = this.adoptionForm.value;
      
      const requestWithPetInfo = {
        ...formData,
        petPhotos: this.pet?.photos || [],
        petName: this.pet?.name || '',
        petSpecies: this.pet?.species || '',
        petBreed: this.pet?.breed || '',
        petAge: (this.pet as any)?.age || '',
        petGender: (this.pet as any)?.gender || '',
        petSize: (this.pet as any)?.size || '',
        petDescription: (this.pet as any)?.description || ''
      };
      
      this.adoptionService.submitAdoptionRequest(this.petId, requestWithPetInfo, null).subscribe({
        next: (response: any) => {
          this.handleSuccessfulSubmission();
        },
        error: (error: any) => {
          this.isSubmitting = false;
          alert('Erro ao enviar formulário. Tente novamente.');
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.adoptionForm.controls).forEach(key => {
      this.adoptionForm.get(key)?.markAsTouched();
    });
  }

  private handleSuccessfulSubmission(): void {
    this.isSubmitting = false;
    this.showSuccessModal = true;
    this.adoptionForm.reset();
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  getBreedDisplay(breed: string, species: string): string {
    if (breed === 'Vira-lata' && species === 'dog') {
      return 'SRD';
    } else if (breed === 'Sem raça definida' && species === 'cat') {
      return 'SRD';
    } else if (breed && breed.trim()) {
      return breed;
    } else {
      return 'SRD';
    }
  }

  private formatPhoneNumber(value: string, fieldName: string): void {
    const phoneControl = this.adoptionForm.get(fieldName);
    if (!phoneControl) return;

    let formattedValue = value.replace(/\D/g, '');
    
    if (formattedValue.length <= 11) {
      if (formattedValue.length <= 2) {
        formattedValue = formattedValue;
      } else if (formattedValue.length <= 6) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2)}`;
      } else if (formattedValue.length <= 10) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 6)}-${formattedValue.slice(6)}`;
      } else {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 7)}-${formattedValue.slice(7, 11)}`;
      }
    }
    
    if (formattedValue !== value) {
      phoneControl.setValue(formattedValue, { emitEvent: false });
    }
  }
}