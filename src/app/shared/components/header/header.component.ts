import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  isScrolled = false;
  isAdoptionDropdownOpen = false;
  isMobileAdoptionDropdownOpen = false;
  isOnAdoptionPage = false;
  
  constructor(private router: Router) { 
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isOnAdoptionPage = event.url.includes('/pets/adoption');
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const header = target.closest('.app-header');
    
    if (!header && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleAdoptionDropdown(): void {
    this.isAdoptionDropdownOpen = !this.isAdoptionDropdownOpen;
  }

  openAdoptionDropdown(): void {
    this.isAdoptionDropdownOpen = true;
  }

  closeAdoptionDropdown(): void {
    this.isAdoptionDropdownOpen = false;
  }

  toggleMobileAdoptionDropdown(): void {
    this.isMobileAdoptionDropdownOpen = !this.isMobileAdoptionDropdownOpen;
  }

  closeMobileAdoptionDropdown(): void {
    this.isMobileAdoptionDropdownOpen = false;
  }
}
