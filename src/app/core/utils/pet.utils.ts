import { Pet } from '../models/pet.model';

export class PetUtils {
  private static readonly cities = [
    'São Paulo, SP', 
    'Rio de Janeiro, RJ', 
    'Belo Horizonte, MG', 
    'Salvador, BA',
    'Brasília, DF',
    'Fortaleza, CE',
    'Recife, PE',
    'Porto Alegre, RS'
  ];

  private static readonly breeds = [
    'Golden Retriever', 
    'Labrador', 
    'Pastor Alemão', 
    'Bulldog', 
    'Husky', 
    'Beagle',
    'Persa',
    'Siamês',
    'Maine Coon',
    'Ragdoll'
  ];


  static getPetType(pet: Pet): string {
    if (pet.category?.name) {
      return pet.category.name;
    }
    
    if (pet.name) {
      const name = pet.name.toLowerCase();
      if (name.includes('dog') || name.includes('cachorro')) return 'Cachorro';
      if (name.includes('cat') || name.includes('gato')) return 'Gato';
    }
    
    return ((pet.id || 1) % 2 === 0) ? 'Cachorro' : 'Gato';
  }


  static getPetAge(pet: Pet): string {
    if (pet.tags && pet.tags.length > 0) {
      const ageTag = pet.tags.find(tag => 
        tag.name?.includes('anos') || 
        tag.name?.includes('meses') ||
        tag.name?.includes('years') ||
        tag.name?.includes('months')
      );
      if (ageTag?.name) {
        return ageTag.name;
      }
    }
    
    const age = ((pet.id || 1) % 5) + 1;
    return `${age} anos`;
  }

  static getPetLocation(pet: Pet): string {
    if (pet.tags && pet.tags.length > 0) {
      const locationTag = pet.tags.find(tag => 
        this.cities.some(city => tag.name?.includes(city.split(',')[1].trim()))
      );
      if (locationTag?.name) {
        return locationTag.name;
      }
    }
    
    return this.cities[((pet.id || 1) % this.cities.length)];
  }

  static getPetBreed(pet: Pet): string {
    if (pet.tags && pet.tags.length > 0) {
      const breedTag = pet.tags.find(tag => 
        tag.name && 
        !this.isAgeTag(tag.name) && 
        !this.isLocationTag(tag.name)
      );
      if (breedTag?.name) {
        return breedTag.name;
      }
    }
    
    return this.breeds[((pet.id || 1) % this.breeds.length)];
  }

  static getStatusText(status: string | undefined): string {
    switch (status) {
      case 'available': return 'Disponível';
      case 'pending': return 'Pendente';
      case 'sold': return 'Adotado';
      default: return 'Disponível';
    }
  }

  static getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warn';
      case 'sold': return 'primary';
      default: return 'success';
    }
  }

  private static isAgeTag(tagName: string): boolean {
    const ageKeywords = ['anos', 'meses', 'years', 'months', 'age'];
    return ageKeywords.some(keyword => tagName.toLowerCase().includes(keyword));
  }

  private static isLocationTag(tagName: string): boolean {
    const states = ['SP', 'RJ', 'MG', 'BA', 'DF', 'CE', 'PE', 'RS'];
    return states.some(state => tagName.includes(state));
  }

  static getDisplayName(pet: Pet): string {
    return pet.name || `Pet ${pet.id || 'Sem ID'}`;
  }

  static isAvailable(pet: Pet): boolean {
    return pet.status === 'available';
  }

  static getPetSummary(pet: Pet): string {
    const type = this.getPetType(pet);
    const age = this.getPetAge(pet);
    const location = this.getPetLocation(pet);
    
    return `${type} • ${age} • ${location}`;
  }
}
