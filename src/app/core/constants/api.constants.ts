export const API_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  PROFILE: '/api/auth/me',
  USERS: '/users',
  CREATE_WITH_ARRAY: '/user/createWithArray',
  CREATE_WITH_LIST: '/user/createWithList',
  LOGOUT: '/user/logout'
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token'
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Erro na operação do usuário. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  INVALID_DATA: 'Dados do usuário inválidos.',
  USER_NOT_FOUND: 'Usuário não encontrado.',
  UNAUTHORIZED: 'Acesso negado. Faça login novamente.',
  SERVER_ERROR: 'Erro interno do servidor.',
  VALIDATION_FAILED: 'Dados de entrada inválidos.'
} as const;

export const HTTP_HEADERS = {
  JSON: { 'Content-Type': 'application/json' },
  AUTH: (token: string) => ({ 'Authorization': `Bearer ${token}` })
} as const;
