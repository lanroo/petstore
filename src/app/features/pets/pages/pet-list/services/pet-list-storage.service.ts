import { Injectable } from '@angular/core';
import { PET_LIST_CONFIG } from '../constants/pet-list.constants';
import { ViewMode } from '../interfaces/pet-list.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PetListStorageService {
  

  loadFavorites(): Set<number> {
    try {
      const saved = localStorage.getItem(PET_LIST_CONFIG.STORAGE.FAVORITES_KEY);
      if (saved) {
        const favoriteIds = JSON.parse(saved) as number[];
        return new Set(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    return new Set();
  }


  saveFavorites(favoriteIds: Set<number>): void {
    try {
      const favoriteArray = Array.from(favoriteIds);
      localStorage.setItem(PET_LIST_CONFIG.STORAGE.FAVORITES_KEY, JSON.stringify(favoriteArray));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }


  loadViewMode(): ViewMode {
    try {
      const saved = localStorage.getItem(PET_LIST_CONFIG.STORAGE.VIEW_MODE_KEY);
      if (saved && (saved === 'grid' || saved === 'list')) {
        return saved;
      }
    } catch (error) {
      console.error('Error loading view mode:', error);
    }
    return PET_LIST_CONFIG.VIEW.DEFAULT_VIEW_MODE;
  }


  saveViewMode(viewMode: ViewMode): void {
    try {
      localStorage.setItem(PET_LIST_CONFIG.STORAGE.VIEW_MODE_KEY, viewMode);
    } catch (error) {
      console.error('Error saving view mode:', error);
    }
  }

  clearAllData(): void {
    try {
      localStorage.removeItem(PET_LIST_CONFIG.STORAGE.FAVORITES_KEY);
      localStorage.removeItem(PET_LIST_CONFIG.STORAGE.VIEW_MODE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
