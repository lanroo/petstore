import { API_ENDPOINTS } from './api.constants';

describe('API Constants', () => {
  it('should have LOGIN endpoint', () => {
    expect(API_ENDPOINTS.LOGIN).toBe('/api/auth/login');
  });

  it('should have USERS endpoint', () => {
    expect(API_ENDPOINTS.USERS).toBe('/users');
  });

  it('should have REGISTER endpoint', () => {
    expect(API_ENDPOINTS.REGISTER).toBe('/api/auth/register');
  });

  it('should have PROFILE endpoint', () => {
    expect(API_ENDPOINTS.PROFILE).toBe('/api/auth/me');
  });
});
