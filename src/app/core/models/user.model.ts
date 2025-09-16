export interface User {
  readonly id: number;
  readonly full_name: string;
  readonly email: string;
  readonly phone?: string;
  readonly city?: string;
  readonly created_at: string;
}

export interface CreateUserRequest {
  readonly full_name: string;
  readonly email: string;
  readonly password: string;
  readonly phone?: string;
  readonly city?: string;
}

export interface UpdateUserRequest {
  readonly full_name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly city?: string;
}

export interface LoginRequest {
  readonly username: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in?: number;
}

export interface ApiResponse<T> {
  readonly data?: T;
  readonly message?: string;
  readonly success: boolean;
}

export interface UserProfile {
  readonly id: number;
  readonly full_name: string;
  readonly email: string;
  readonly phone?: string;
  readonly city?: string;
  readonly created_at: string;
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0
}

export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}