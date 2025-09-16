import { Pet, PetFilters, PetStatus } from '../models/pet.model';

export class PetValidators {
  static validatePetId(id: number): void {
    if (!id || id <= 0 || !Number.isInteger(id)) {
      throw new Error('ID do pet deve ser um número inteiro positivo');
    }
  }

  static validatePetData(pet: Partial<Pet>): void {
    if (pet.name && !pet.name.trim()) {
      throw new Error('Nome do pet é obrigatório');
    }
    if (pet.species && !['dog', 'cat'].includes(pet.species)) {
      throw new Error('Espécie deve ser "dog" ou "cat"');
    }
    if (pet.gender && !['male', 'female'].includes(pet.gender)) {
      throw new Error('Gênero deve ser "male" ou "female"');
    }
    if (pet.size && !['small', 'medium', 'large'].includes(pet.size)) {
      throw new Error('Tamanho deve ser "small", "medium" ou "large"');
    }
    if (pet.age && (pet.age < 0 || pet.age > 30)) {
      throw new Error('Idade deve estar entre 0 e 30 anos');
    }
  }

  static validatePetFilters(filters: PetFilters): void {
    if (filters.species && !['dog', 'cat'].includes(filters.species)) {
      throw new Error('Espécie inválida no filtro');
    }
    if (filters.status && !Object.values(PetStatus).includes(filters.status)) {
      throw new Error('Status inválido no filtro');
    }
    if (filters.gender && !['male', 'female'].includes(filters.gender)) {
      throw new Error('Gênero inválido no filtro');
    }
    if (filters.min_age && filters.min_age < 0) {
      throw new Error('Idade mínima não pode ser negativa');
    }
    if (filters.max_age && filters.max_age < 0) {
      throw new Error('Idade máxima não pode ser negativa');
    }
    if (filters.min_age && filters.max_age && filters.min_age > filters.max_age) {
      throw new Error('Idade mínima não pode ser maior que a máxima');
    }
    if (filters.page && filters.page < 1) {
      throw new Error('Página deve ser maior que 0');
    }
    if (filters.limit && filters.limit < 1) {
      throw new Error('Limite deve ser maior que 0');
    }
  }

  static validateSearchQuery(query: string): void {
    if (!query || !query.trim()) {
      throw new Error('Termo de busca é obrigatório');
    }
    if (query.trim().length < 2) {
      throw new Error('Termo de busca deve ter pelo menos 2 caracteres');
    }
  }

  static validateFileUpload(files: File[]): void {
    if (!files || files.length === 0) {
      throw new Error('Pelo menos um arquivo deve ser selecionado');
    }
    if (files.length > 10) {
      throw new Error('Máximo de 10 arquivos por upload');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    files.forEach((file, index) => {
      if (file.size > maxSize) {
        throw new Error(`Arquivo ${index + 1} excede o tamanho máximo de 5MB`);
      }
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Arquivo ${index + 1} deve ser uma imagem (JPEG, PNG ou WebP)`);
      }
    });
  }

  static validateAdoptionRequest(userId: number): void {
    if (!userId || userId <= 0 || !Number.isInteger(userId)) {
      throw new Error('ID do usuário deve ser um número inteiro positivo');
    }
  }
}
