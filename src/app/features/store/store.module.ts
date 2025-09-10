import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StoreRoutingModule } from './store-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class StoreModule { }
