export const ERROR_MESSAGES = {
  GENERIC: 'Algo deu errado. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  INVALID_DATA: 'Dados inválidos. Verifique as informações.',
  UNAUTHORIZED: 'Acesso não autorizado.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Página não encontrada.',
  METHOD_NOT_ALLOWED: 'Operação não permitida.',
  TIMEOUT: 'Tempo limite excedido.',
  TOO_MANY_REQUESTS: 'Muitas tentativas. Tente novamente mais tarde.',
  SERVER_ERROR: 'Erro interno do servidor.',
  BAD_GATEWAY: 'Servidor temporariamente indisponível.',
  SERVICE_UNAVAILABLE: 'Serviço temporariamente indisponível.',
  GATEWAY_TIMEOUT: 'Tempo limite do gateway.',
  APPLICATION_ERROR: 'Erro interno da aplicação'
} as const;

export const ERROR_ROUTES = {
  NOT_FOUND: '/errors/404',
  SERVER_ERROR: '/errors/500',
  UNAUTHORIZED: '/auth/login',
  FORBIDDEN: '/errors/403'
} as const;

export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;
