import { UserValidators } from './user.validators';

describe('UserValidators', () => {
  it('should be created', () => {
    expect(UserValidators).toBeTruthy();
  });

  it('should have validateUserArray method', () => {
    expect(UserValidators.validateUserArray).toBeDefined();
  });
});
