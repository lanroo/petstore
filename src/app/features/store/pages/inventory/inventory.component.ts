import { Component, OnInit } from '@angular/core';
import { StoreService, Inventory } from '../../../../core/services/store.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  inventory: Inventory = {};
  loading = true;
  error: string | null = null;

  stats = {
    available: 0,
    pending: 0,
    sold: 0,
    total: 0,
    other: 0
  };

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  private loadInventory(): void {
    this.loading = true;
    this.error = null;

    this.storeService.getInventory().subscribe({
      next: (inventory) => {
        this.inventory = inventory;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Erro ao carregar inventário:', error);
      }
    });
  }

  private calculateStats(): void {
    this.stats = {
      available: this.inventory['available'] || 0,
      pending: this.inventory['pending'] || 0,
      sold: this.inventory['sold'] || 0,
      total: 0,
      other: 0
    };

    Object.entries(this.inventory).forEach(([status, count]) => {
      this.stats.total += count;
      
      if (!['available', 'pending', 'sold'].includes(status)) {
        this.stats.other += count;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available':
        return '#10b981'; 
      case 'pending':
        return '#f59e0b'; 
      case 'sold':
        return '#7c3aed'; 
      default:
        return '#6b7280'; 
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'available':
        return 'check_circle';
      case 'pending':
        return 'schedule';
      case 'sold':
        return 'pets';
      default:
        return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'pending':
        return 'Pendente';
      case 'sold':
        return 'Vendido';
      default:
        return status;
    }
  }

  refreshInventory(): void {
    this.loadInventory();
  }
}
