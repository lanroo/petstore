import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pet } from '../models/pet.model';

export interface PetImageUrls {
  dog: string[];
  cat: string[];
  other: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly imageUrls: PetImageUrls = {
    dog: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1547407139-3c921a71905c?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=200&h=200&fit=crop'
    ],
    cat: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=200&h=200&fit=crop'
    ],
    other: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop'
    ]
  };

  private readonly defaultImage = this.imageUrls.dog[0];

  getRandomDogImage(): Observable<string> {
    const randomIndex = Math.floor(Math.random() * this.imageUrls.dog.length);
    return of(this.imageUrls.dog[randomIndex]);
  }

  getRandomCatImage(): Observable<string> {
    const randomIndex = Math.floor(Math.random() * this.imageUrls.cat.length);
    return of(this.imageUrls.cat[randomIndex]);
  }

  getRandomPetImage(petType: 'dog' | 'cat' | 'other'): Observable<string> {
    switch (petType) {
      case 'dog':
        return this.getRandomDogImage();
      case 'cat':
        return this.getRandomCatImage();
      default:
        const randomIndex = Math.floor(Math.random() * this.imageUrls.other.length);
        return of(this.imageUrls.other[randomIndex]);
    }
  }

  getValidPhotoUrls(pet: Pet, size: 'small' | 'large' = 'small'): string[] {
    const petType = this.determinePetType(pet);
    const sizeParam = size === 'large' ? 'w=400&h=400' : 'w=200&h=200';
    
    let imageUrls: string[];
    
    switch (petType) {
      case 'dog':
        imageUrls = this.imageUrls.dog;
        break;
      case 'cat':
        imageUrls = this.imageUrls.cat;
        break;
      default:
        imageUrls = this.imageUrls.other;
    }

    const adjustedUrls = size === 'large' 
      ? imageUrls.map(url => url.replace('w=200&h=200', sizeParam))
      : imageUrls;

    const imageIndex = ((pet.id || 1) % adjustedUrls.length);
    return [adjustedUrls[imageIndex]];
  }

  private determinePetType(pet: Pet): 'dog' | 'cat' | 'other' {
    if (pet.category?.name) {
      const categoryName = pet.category.name.toLowerCase();
      if (categoryName.includes('dog') || categoryName.includes('cachorro')) return 'dog';
      if (categoryName.includes('cat') || categoryName.includes('gato')) return 'cat';
    }
    
    if (pet.name) {
      const name = pet.name.toLowerCase();
      if (name.includes('dog') || name.includes('cachorro')) return 'dog';
      if (name.includes('cat') || name.includes('gato')) return 'cat';
    }
    
    return ((pet.id || 1) % 2 === 0) ? 'dog' : 'cat';
  }

  getDefaultImage(): string {
    return this.defaultImage;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }
}
