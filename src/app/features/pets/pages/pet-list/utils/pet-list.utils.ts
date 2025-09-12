import { Pet } from '../../../../../core/models/pet.model';
import { FilterCriteria, SortState } from '../interfaces/pet-list.interfaces';
import { SortBy } from '../constants/pet-list.constants';


export const filterPetsByCriteria = (pets: readonly Pet[], criteria: FilterCriteria): Pet[] => {
  return pets.filter(pet => {
    if (criteria.searchTerm && !matchesSearchTerm(pet, criteria.searchTerm)) {
      return false;
    }
    
    if (criteria.status && pet.status !== criteria.status) {
      return false;
    }
    
    if (criteria.species && pet.species !== criteria.species) {
      return false;
    }
    
    if (criteria.city && pet.city !== criteria.city) {
      return false;
    }
    
    if (criteria.gender && pet.gender !== criteria.gender) {
      return false;
    }
    
    return true;
  });
};

export const matchesSearchTerm = (pet: Pet, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return true;
  
  return (
    pet.name?.toLowerCase().includes(term) ||
    pet.breed?.toLowerCase().includes(term) ||
    pet.description?.toLowerCase().includes(term)
  );
};

export const sortPets = (pets: readonly Pet[], sortState: SortState): Pet[] => {
  return [...pets].sort((a, b) => {
    const aValue = getSortValue(a, sortState.sortBy);
    const bValue = getSortValue(b, sortState.sortBy);
    return compareValues(aValue, bValue, sortState.sortOrder);
  });
};

export const getSortValue = (pet: Pet, sortBy: SortBy): string | number => {
  switch (sortBy) {
    case 'name':
      return pet.name?.toLowerCase() || '';
    case 'age':
      return pet.age || 0;
    case 'species':
      return pet.species || '';
    case 'city':
      return pet.city?.toLowerCase() || '';
    default:
      return pet.name?.toLowerCase() || '';
  }
};

export const compareValues = (aValue: string | number, bValue: string | number, sortOrder: 'asc' | 'desc'): number => {
  if (aValue < bValue) {
    return sortOrder === 'asc' ? -1 : 1;
  }
  if (aValue > bValue) {
    return sortOrder === 'asc' ? 1 : -1;
  }
  return 0;
};

export const createShareData = (pet: Pet, baseUrl: string): { title: string; text: string; url: string } => {
  const petType = pet.species === 'dog' ? 'cachorro' : 'gato';
  const petAge = pet.age ? `${pet.age} anos` : 'idade não informada';
  
  return {
    title: `${pet.name} - Pet para Adoção`,
    text: `Conheça ${pet.name}, um ${petType} ${petAge} em ${pet.city}. ${pet.description || 'Venha conhecer este lindo pet!'}`,
    url: `${baseUrl}/pets/${pet.id}`
  };
};

export const getSortLabel = (sortBy: SortBy): string => {
  const labels: Record<SortBy, string> = {
    name: 'Nome',
    age: 'Idade',
    species: 'Espécie',
    city: 'Cidade'
  };
  return labels[sortBy] || 'Nome';
};

export const isValidSortBy = (value: string): value is SortBy => {
  return ['name', 'age', 'species', 'city'].includes(value);
};

export const isValidViewMode = (value: string): value is 'grid' | 'list' => {
  return value === 'grid' || value === 'list';
};

export const setToArray = <T>(set: Set<T>): T[] => Array.from(set);
export const arrayToSet = <T>(array: T[]): Set<T> => new Set(array);
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
