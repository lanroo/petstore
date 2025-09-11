import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { PetsRoutingModule } from './pets-routing.module';
import { PetListComponent } from './pages/pet-list/pet-list.component';
import { PetDetailComponent } from './pages/pet-detail/pet-detail.component';
import { PetFormComponent } from './pages/pet-form/pet-form.component';

@NgModule({
  declarations: [
    PetListComponent,
    PetDetailComponent,
    PetFormComponent
  ],
  imports: [
    CommonModule,
    PetsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatChipsModule,
    MatExpansionModule
  ]
})
export class PetsModule { }
