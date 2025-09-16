

export const PET_LIST_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 30,
    PAGE_SIZE_OPTIONS: [30],
    DEFAULT_FIRST: 0
  },
  SORTING: {
    DEFAULT_SORT_BY: 'name' as const,
    DEFAULT_SORT_ORDER: 'asc' as const,
    SORT_OPTIONS: [
      { value: 'name', label: 'Nome', icon: 'sort_by_alpha' },
      { value: 'age', label: 'Idade', icon: 'cake' },
      { value: 'species', label: 'Espécie', icon: 'pets' },
      { value: 'city', label: 'Cidade', icon: 'location_on' }
    ] as const
  },
  VIEW: {
    DEFAULT_VIEW_MODE: 'grid' as const,
    VIEW_MODES: [
      { value: 'grid', label: 'Grade', icon: 'grid_view' },
      { value: 'list', label: 'Lista', icon: 'list' }
    ] as const
  },
  FILTERS: {
    STATUS_OPTIONS: [
      { value: '', label: 'Todos' },
      { value: 'available', label: 'Disponível' },
      { value: 'adopted', label: 'Adotado' }
    ] as const,
    SPECIES_OPTIONS: [
      { value: '', label: 'Todas' },
      { value: 'dog', label: 'Cachorro' },
      { value: 'cat', label: 'Gato' }
    ] as const,
    GENDER_OPTIONS: [
      { value: '', label: 'Todos' },
      { value: 'male', label: 'Macho' },
      { value: 'female', label: 'Fêmea' }
    ] as const,
    CITIES: [
      'São Paulo',
      'Rio de Janeiro',
      'Belo Horizonte',
      'Salvador',
      'Brasília',
      'Fortaleza',
      'Manaus',
      'Curitiba',
      'Recife',
      'Porto Alegre'
    ] as const
  },
  STORAGE: {
    FAVORITES_KEY: 'favoritePets',
    VIEW_MODE_KEY: 'petViewMode'
  },
  UI: {
    SKELETON_ITEMS_COUNT: 6,
    HERO_STATS: {
      CITIES_COUNT: 10,
      IS_FREE: true
    }
  }
} as const;

export type SortBy = typeof PET_LIST_CONFIG.SORTING.SORT_OPTIONS[number]['value'];
export type SortOrder = 'asc' | 'desc';
export type ViewMode = typeof PET_LIST_CONFIG.VIEW.VIEW_MODES[number]['value'];
export type FilterStatus = typeof PET_LIST_CONFIG.FILTERS.STATUS_OPTIONS[number]['value'];
export type FilterSpecies = typeof PET_LIST_CONFIG.FILTERS.SPECIES_OPTIONS[number]['value'];
export type FilterGender = typeof PET_LIST_CONFIG.FILTERS.GENDER_OPTIONS[number]['value'];
