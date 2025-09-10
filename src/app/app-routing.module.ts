import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'pets',
    loadChildren: () => import('./features/pets/pets.module').then(m => m.PetsModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./features/store/store.module').then(m => m.StoreModule)
  },
  {
    path: 'errors',
    loadChildren: () => import('./features/errors/errors.module').then(m => m.ErrorsModule)
  },
  {
    path: '**',
    redirectTo: 'errors/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
