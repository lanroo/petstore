import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PetService } from '../../../../core/services/pet.service';
import { Pet, PetStatus } from '../../../../core/models/pet.model';

interface PetFormData {
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  description: string;
  status: PetStatus;
  image?: File;
}

@Component({
  selector: 'app-pet-form',
  standalone: false,
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  petForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  petId?: number;
  imagePreview?: string;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.petId = params['id'] ? +params['id'] : undefined;
      this.isEditMode = !!this.petId;
      
      if (this.isEditMode) {
        this.loadPetData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): void {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      species: ['', Validators.required],
      breed: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      gender: ['', Validators.required],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      status: [PetStatus.AVAILABLE]
    });
  }

  private loadPetData(): void {
    if (!this.petId) return;

    this.isLoading = true;
    this.petService.getPetById(this.petId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (pet) => {
        this.populateForm(pet);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading pet:', error);
        this.errorMessage = 'Erro ao carregar dados do pet. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private populateForm(pet: Pet): void {
    this.petForm.patchValue({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender || '',
      city: pet.city || '',
      description: pet.description || '',
      status: pet.status || PetStatus.AVAILABLE
    });

    if (pet.photos && pet.photos.length > 0) {
      this.imagePreview = pet.photos[0];
    }
  }

  onSubmit(): void {
    if (this.petForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const formData: PetFormData = this.petForm.value;
      const petData: Pet = this.mapFormToPet(formData);

      if (this.isEditMode && this.petId) {
        this.updatePet(this.petId, petData);
      } else {
        this.createPet(petData);
      }
    } else {
      this.markAllFieldsAsTouched();
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }

  private createPet(petData: Pet): void {
    this.petService.createPet(petData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('✅ Pet created successfully:', response);
        this.successMessage = 'Pet adicionado com sucesso!';
        this.isLoading = false;
        
        setTimeout(() => {
          this.router.navigate(['/pets']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error creating pet:', error);
        this.errorMessage = 'Erro ao adicionar pet. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private updatePet(petId: number, petData: Pet): void {
    this.petService.updatePet(petId, petData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('✅ Pet updated successfully:', response);
        this.successMessage = 'Pet atualizado com sucesso!';
        this.isLoading = false;
        
        setTimeout(() => {
          this.router.navigate(['/pets', petId]);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error updating pet:', error);
        this.errorMessage = 'Erro ao atualizar pet. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private mapFormToPet(formData: PetFormData): Pet {
    return {
      id: this.petId,
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: formData.age,
      gender: formData.gender,
      city: formData.city,
      description: formData.description,
      status: formData.status,
      photos: this.imagePreview ? [this.imagePreview] : []
    };
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor, selecione apenas arquivos de imagem.';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'A imagem deve ter no máximo 5MB.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.clearMessages();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = undefined;
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.petId) {
      this.router.navigate(['/pets', this.petId]);
    } else {
      this.router.navigate(['/pets']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.petForm.controls).forEach(key => {
      const control = this.petForm.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
