import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [

  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  
  {
    path: 'admin',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'user',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/user/user/user.module').then(m => m.UserModule)
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
