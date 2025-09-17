import { StoreValidators } from './store.validators';

describe('StoreValidators', () => {
  it('should be created', () => {
    expect(StoreValidators).toBeTruthy();
  });

  it('should have validateOrderRequest method', () => {
    expect(StoreValidators.validateOrderRequest).toBeDefined();
  });

  it('should have validateOrderId method', () => {
    expect(StoreValidators.validateOrderId).toBeDefined();
  });
});
