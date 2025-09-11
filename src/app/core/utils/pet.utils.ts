import { Pet } from '../models/pet.model';

export class PetUtils {
  static getPetType(pet: Pet): string {
    return pet.species === 'dog' ? 'Cachorro' : 'Gato';
  }

  static getPetAge(pet: Pet): string {
    if (pet.age < 12) {
      return `${pet.age} meses`;
    } else {
      const years = Math.floor(pet.age / 12);
      const months = pet.age % 12;
      if (months === 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      } else {
        return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
    }
  }

  static getPetLocation(pet: Pet): string {
    return pet.city;
  }

  static getPetBreed(pet: Pet): string {
    return pet.breed;
  }

  static getPetGender(pet: Pet): string {
    return pet.gender === 'male' ? 'Macho' : 'Fêmea';
  }

  static getStatusText(status: string | undefined): string {
    switch (status) {
      case 'available': return 'Disponível';
      case 'adopted': return 'Adotado';
      default: return 'Disponível';
    }
  }

  static getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'available': return 'success';
      case 'adopted': return 'primary';
      default: return 'success';
    }
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

  static getPetDescription(pet: Pet): string {
    return pet.description || 'Pet muito carinhoso e brincalhão';
  }
}
