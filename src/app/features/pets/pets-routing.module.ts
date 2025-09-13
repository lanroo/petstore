import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetListComponent } from './pages/pet-list/pet-list.component';
import { PetDetailComponent } from './pages/pet-detail/pet-detail.component';
import { PetFormComponent } from './pages/pet-form/pet-form.component';
import { AdoptionComponent } from './pages/adoption/adoption.component';
import { FaqComponent } from './pages/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    component: PetListComponent
  },
  {
    path: 'adoption',
    component: AdoptionComponent
  },
  {
    path: 'adoption/:petId',
    component: AdoptionComponent
  },
  {
    path: 'faq',
    component: FaqComponent
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
