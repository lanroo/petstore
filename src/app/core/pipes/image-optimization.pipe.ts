import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optimizeImage',
  standalone: true
})
export class OptimizeImagePipe implements PipeTransform {

  transform(imageUrl: string, size: 'small' | 'medium' | 'large' = 'medium', format: 'webp' | 'jpg' | 'png' = 'webp'): string {
    if (!imageUrl) {
      return this.getDefaultImage(size);
    }

    if (imageUrl.includes('cloudinary.com')) {
      return this.optimizeCloudinaryImage(imageUrl, size, format);
    }

    return this.addLazyLoading(imageUrl);
  }

  private optimizeCloudinaryImage(url: string, size: 'small' | 'medium' | 'large', format: 'webp' | 'jpg' | 'png'): string {
    const sizeMap: Record<'small' | 'medium' | 'large', string> = {
      small: 'w_300,h_300,c_fill,q_auto,f_auto',
      medium: 'w_600,h_600,c_fill,q_auto,f_auto',
      large: 'w_1200,h_1200,c_fill,q_auto,f_auto'
    };

    const formatMap: Record<'webp' | 'jpg' | 'png', string> = {
      webp: 'f_webp',
      jpg: 'f_jpg',
      png: 'f_png'
    };

    const transformations = `${sizeMap[size]},${formatMap[format]}`;
    
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  private addLazyLoading(url: string): string {
    return url;
  }

  private getDefaultImage(size: 'small' | 'medium' | 'large'): string {
    const sizeMap: Record<'small' | 'medium' | 'large', string> = {
      small: 'w_300,h_300',
      medium: 'w_600,h_600',
      large: 'w_1200,h_1200'
    };

    return `https://via.placeholder.com/${sizeMap[size]}/f3f4f6/9ca3af?text=Pet+Image`;
  }
}
