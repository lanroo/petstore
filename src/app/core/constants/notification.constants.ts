export const NOTIFICATION_DEFAULTS = {
  SUCCESS_DURATION: 5000,
  ERROR_DURATION: 8000,
  WARNING_DURATION: 6000,
  INFO_DURATION: 4000,
  PERSISTENT_ERROR_DURATION: undefined
} as const;

export const NOTIFICATION_MESSAGES = {
  PET_CREATED: (petName: string) => ({
    title: 'Pet Cadastrado!',
    message: `${petName} foi cadastrado com sucesso e está aguardando adoção.`
  }),
  PET_UPDATED: (petName: string) => ({
    title: 'Pet Atualizado!',
    message: `As informações de ${petName} foram atualizadas.`
  }),
  PET_DELETED: (petName: string) => ({
    title: 'Pet Removido',
    message: `${petName} foi removido da lista de adoção.`
  }),
  PET_ADOPTED: (petName: string) => ({
    title: 'Pet Adotado! 🎉',
    message: `${petName} encontrou uma família! Parabéns!`
  }),
  NETWORK_ERROR: {
    title: 'Erro de Conexão',
    message: 'Verifique sua conexão com a internet e tente novamente.'
  },
  VALIDATION_ERROR: (field: string) => ({
    title: 'Dados Inválidos',
    message: `Por favor, verifique o campo: ${field}`
  }),
  UNAUTHORIZED_ERROR: {
    title: 'Acesso Negado',
    message: 'Você não tem permissão para realizar esta ação.'
  },
  SERVER_ERROR: {
    title: 'Erro no Servidor',
    message: 'Ocorreu um erro interno. Nossa equipe foi notificada.'
  }
} as const;
