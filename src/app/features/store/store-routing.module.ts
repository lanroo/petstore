import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './pages/inventory/inventory.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    component: InventoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
