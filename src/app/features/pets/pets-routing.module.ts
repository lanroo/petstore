import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetListComponent } from './pages/pet-list/pet-list.component';
import { PetDetailComponent } from './pages/pet-detail/pet-detail.component';
import { PetFormComponent } from './pages/pet-form/pet-form.component';

const routes: Routes = [
  {
    path: '',
    component: PetListComponent
  },
  {
    path: 'new',
    component: PetFormComponent
  },
  {
    path: ':id',
    component: PetDetailComponent
  },
  {
    path: ':id/edit',
    component: PetFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetsRoutingModule { }
