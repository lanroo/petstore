import { PetValidators } from './pet.validators';

describe('PetValidators', () => {
  it('should be created', () => {
    expect(PetValidators).toBeTruthy();
  });

  it('should have validatePetId method', () => {
    expect(PetValidators.validatePetId).toBeDefined();
  });
});
