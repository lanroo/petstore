export const STORE_API_ENDPOINTS = {
  INVENTORY: '/store/inventory',
  ORDER: '/store/order',
  ORDER_BY_ID: (id: number) => `/store/order/${id}`
} as const;

export const STORE_ERROR_MESSAGES = {
  GENERIC: 'Erro na operação da loja. Tente novamente.',
  INVALID_ORDER: 'Dados do pedido inválidos.',
  ORDER_NOT_FOUND: 'Pedido não encontrado.',
  INVENTORY_ERROR: 'Erro ao carregar inventário.',
  SERVER_ERROR: 'Erro interno do servidor.'
} as const;

export const INVENTORY_STATUSES = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  SOLD: 'sold'
} as const;
