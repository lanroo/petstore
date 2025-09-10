import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCounter = 0;
  private loadingStates = new Map<string, boolean>();

  constructor() {}

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }


  get isLoading(): boolean {
    return this.loadingSubject.value;
  }


  show(): void {
    this.loadingCounter++;
    if (this.loadingCounter === 1) {
      this.loadingSubject.next(true);
    }
  }


  hide(): void {
    this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    if (this.loadingCounter === 0) {
      this.loadingSubject.next(false);
    }
  }


  showForOperation(operationId: string): void {
    this.loadingStates.set(operationId, true);
    this.show();
  }


  hideForOperation(operationId: string): void {
    if (this.loadingStates.has(operationId)) {
      this.loadingStates.delete(operationId);
      this.hide();
    }
  }


  isOperationLoading(operationId: string): boolean {
    return this.loadingStates.get(operationId) || false;
  }


  withLoading<T>(source: Observable<T>, operationId?: string): Observable<T> {
    if (operationId) {
      this.showForOperation(operationId);
      return source.pipe(
        finalize(() => this.hideForOperation(operationId))
      );
    } else {
      this.show();
      return source.pipe(
        finalize(() => this.hide())
      );
    }
  }


  async withLoadingAsync<T>(
    operation: () => Promise<T>, 
    operationId?: string
  ): Promise<T> {
    try {
      if (operationId) {
        this.showForOperation(operationId);
      } else {
        this.show();
      }
      
      return await operation();
    } finally {
      if (operationId) {
        this.hideForOperation(operationId);
      } else {
        this.hide();
      }
    }
  }


  reset(): void {
    this.loadingCounter = 0;
    this.loadingStates.clear();
    this.loadingSubject.next(false);
  }


  getLoadingStates(): { [key: string]: boolean } {
    return Object.fromEntries(this.loadingStates);
  }


  // Pet operations
  loadingPets(): void {
    this.showForOperation('loading-pets');
  }

  loadingPetDetails(petId: number): void {
    this.showForOperation(`loading-pet-${petId}`);
  }

  savingPet(): void {
    this.showForOperation('saving-pet');
  }

  deletingPet(petId: number): void {
    this.showForOperation(`deleting-pet-${petId}`);
  }

  uploadingImage(petId: number): void {
    this.showForOperation(`uploading-image-${petId}`);
  }

  stopLoadingPets(): void {
    this.hideForOperation('loading-pets');
  }

  stopLoadingPetDetails(petId: number): void {
    this.hideForOperation(`loading-pet-${petId}`);
  }

  stopSavingPet(): void {
    this.hideForOperation('saving-pet');
  }

  stopDeletingPet(petId: number): void {
    this.hideForOperation(`deleting-pet-${petId}`);
  }

  stopUploadingImage(petId: number): void {
    this.hideForOperation(`uploading-image-${petId}`);
  }
}