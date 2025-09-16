export const PET_API_ENDPOINTS = {
  PETS: '/pets',
  PET_BY_ID: (id: number) => `/pets/${id}`,
  PET_PHOTOS: (id: number) => `/pets/${id}/photos`,
  PET_ADOPT: (id: number) => `/pets/${id}/adopt`,
  PET_STATS: '/pets/stats',
  PET_FILTERS: '/pets/filters/options',
  PET_SEARCH: '/pets/search'
} as const;

export const PET_DEFAULTS = {
  LIMIT: 100,
  PAGE: 1
} as const;

export const PET_ERROR_MESSAGES = {
  GENERIC: 'Erro na operação do pet. Tente novamente.',
  NOT_FOUND: 'Pet não encontrado.',
  INVALID_DATA: 'Dados do pet inválidos.',
  UPLOAD_FAILED: 'Erro ao fazer upload das fotos.',
  ADOPTION_FAILED: 'Erro ao processar adoção.',
  OPERATION_NOT_ALLOWED: 'Operação não permitida.',
  SERVER_ERROR: 'Erro interno do servidor.'
} as const;

export const PET_IMAGE_SIZES = {
  SMALL: 'w=200&h=200',
  LARGE: 'w=400&h=400'
} as const;
