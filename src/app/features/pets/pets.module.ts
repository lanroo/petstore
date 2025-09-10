import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class PetsModule { }
