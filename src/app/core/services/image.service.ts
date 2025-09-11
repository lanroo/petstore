import { Injectable } from '@angular/core';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly defaultImage = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';

  getPetImage(pet: Pet, size: 'small' | 'large' = 'small'): string {
    if (!this.hasPhotos(pet)) {
      return this.defaultImage;
    }
    
    const imageUrl = pet.photos[0];
    return this.adjustImageSize(imageUrl, size);
  }

  private hasPhotos(pet: Pet): boolean {
    return pet.photos && pet.photos.length > 0;
  }

  private adjustImageSize(imageUrl: string, size: 'small' | 'large'): string {
    if (!imageUrl.includes('unsplash.com')) {
      return imageUrl;
    }
    
    const sizeParam = size === 'large' ? 'w=400&h=400' : 'w=200&h=200';
    return imageUrl.replace(/w=\d+&h=\d+/, sizeParam);
  }

  getDefaultImage(): string {
    return this.defaultImage;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }
}
