import { Pet } from '../../../../../core/models/pet.model';
import { SortBy, SortOrder, FilterStatus, FilterSpecies, FilterGender } from '../constants/pet-list.constants';

export type ViewMode = 'grid' | 'list';

export interface FilterCriteria {
  readonly searchTerm: string;
  readonly status: FilterStatus;
  readonly species: FilterSpecies;
  readonly city: string;
  readonly gender: FilterGender;
}

export interface PaginationState {
  readonly first: number;
  readonly rows: number;
  readonly currentPage: number;
  readonly totalRecords: number;
}

export interface SortState {
  readonly sortBy: SortBy;
  readonly sortOrder: SortOrder;
}

export interface FilterState {
  readonly searchTerm: string;
  readonly selectedStatus: FilterStatus;
  readonly selectedSpecies: FilterSpecies;
  readonly selectedCity: string;
  readonly selectedGender: FilterGender;
}

export interface UIState {
  readonly loading: boolean;
  readonly viewMode: ViewMode;
  readonly sortDropdownOpen: boolean;
  readonly filtersExpanded: boolean;
}

export interface PetListState {
  readonly pets: readonly Pet[];
  readonly filteredPets: readonly Pet[];
  readonly favoritePets: ReadonlySet<number>;
  readonly pagination: PaginationState;
  readonly sort: SortState;
  readonly filters: FilterState;
  readonly ui: UIState;
}

export interface SortOption {
  readonly value: SortBy;
  readonly label: string;
  readonly icon: string;
}

export interface FilterOption<T = string> {
  readonly value: T;
  readonly label: string;
}

export interface ShareData {
  readonly title: string;
  readonly text: string;
  readonly url: string;
}

export interface PageChangeEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}
