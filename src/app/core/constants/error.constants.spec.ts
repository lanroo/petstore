import { ERROR_MESSAGES } from './error.constants';

describe('Error Constants', () => {
  it('should have NETWORK message', () => {
    expect(ERROR_MESSAGES.NETWORK).toBe('Erro de conexão. Verifique sua internet.');
  });

  it('should have SERVER_ERROR message', () => {
    expect(ERROR_MESSAGES.SERVER_ERROR).toBe('Erro interno do servidor.');
  });

  it('should have NOT_FOUND message', () => {
    expect(ERROR_MESSAGES.NOT_FOUND).toBe('Página não encontrada.');
  });

  it('should have UNAUTHORIZED message', () => {
    expect(ERROR_MESSAGES.UNAUTHORIZED).toBe('Acesso não autorizado.');
  });

  it('should have FORBIDDEN message', () => {
    expect(ERROR_MESSAGES.FORBIDDEN).toBe('Acesso negado.');
  });

  it('should have INVALID_DATA message', () => {
    expect(ERROR_MESSAGES.INVALID_DATA).toBe('Dados inválidos. Verifique as informações.');
  });
});
