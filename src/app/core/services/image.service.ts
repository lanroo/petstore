import { Injectable } from '@angular/core';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly defaultImage = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';

  getPetImage(pet: Pet, size: 'small' | 'medium' | 'large' = 'small'): string {
    if (!this.hasPhotos(pet)) {
      return this.getOptimizedDefaultImage(size);
    }
    
    const imageUrl = pet.photos[0];
    return this.optimizeImage(imageUrl, size);
  }

  private hasPhotos(pet: Pet): boolean {
    return pet.photos && pet.photos.length > 0;
  }

  private optimizeImage(imageUrl: string, size: 'small' | 'medium' | 'large'): string {
    if (imageUrl.includes('cloudinary.com')) {
      return this.optimizeCloudinaryImage(imageUrl, size);
    }
    
    if (imageUrl.includes('unsplash.com')) {
      return this.optimizeUnsplashImage(imageUrl, size);
    }
    
    return imageUrl;
  }

  private optimizeCloudinaryImage(url: string, size: string): string {
    const sizeMap = {
      small: 'w_300,h_300,c_fill,q_auto,f_webp',
      medium: 'w_600,h_600,c_fill,q_auto,f_webp',
      large: 'w_1200,h_1200,c_fill,q_auto,f_webp'
    };

    const transformations = sizeMap[size as keyof typeof sizeMap];
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  private optimizeUnsplashImage(url: string, size: string): string {
    const sizeMap = {
      small: 'w=300&h=300&fit=crop&fm=webp&q=80',
      medium: 'w=600&h=600&fit=crop&fm=webp&q=80',
      large: 'w=1200&h=1200&fit=crop&fm=webp&q=80'
    };

    const params = sizeMap[size as keyof typeof sizeMap];
    return `${url.split('?')[0]}?${params}`;
  }

  private getOptimizedDefaultImage(size: 'small' | 'medium' | 'large'): string {
    const sizeMap = {
      small: 'w=300&h=300&fit=crop&fm=webp&q=80',
      medium: 'w=600&h=600&fit=crop&fm=webp&q=80',
      large: 'w=1200&h=1200&fit=crop&fm=webp&q=80'
    };

    const params = sizeMap[size];
    return `https://images.unsplash.com/photo-1552053831-71594a27632d?${params}`;
  }

  getDefaultImage(): string {
    return this.defaultImage;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }
}
