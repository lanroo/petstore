export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  code?: number;
  type?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
  