import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-pet-list',
  standalone: false,
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss'
})
export class PetListComponent {
  showScrollIndicator = true;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY;
    this.showScrollIndicator = scrollPosition < 100;
  }
}
