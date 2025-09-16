import { CreateUserRequest, UpdateUserRequest } from '../models/user.model';

export class UserValidators {
  static validateCreateUserRequest(userData: CreateUserRequest): void {
    if (!userData.full_name?.trim()) {
      throw new Error('Nome completo é obrigatório');
    }
    if (!userData.email?.trim() || !this.isValidEmail(userData.email)) {
      throw new Error('Email válido é obrigatório');
    }
    if (!userData.password?.trim() || userData.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
  }

  static validateUpdateUserRequest(userData: UpdateUserRequest): void {
    if (userData.email && !this.isValidEmail(userData.email)) {
      throw new Error('Email inválido');
    }
    if (userData.full_name && !userData.full_name.trim()) {
      throw new Error('Nome completo não pode estar vazio');
    }
  }

  static validateUserArray(users: CreateUserRequest[]): void {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('Lista de usuários não pode estar vazia');
    }
    users.forEach((user, index) => {
      try {
        this.validateCreateUserRequest(user);
      } catch (error) {
        throw new Error(`Usuário ${index + 1}: ${error}`);
      }
    });
  }

  static validateUsername(username: string): void {
    if (!username?.trim()) {
      throw new Error('Username é obrigatório');
    }
  }

  static validateLoginCredentials(username: string, password: string): void {
    if (!username?.trim()) {
      throw new Error('Username é obrigatório');
    }
    if (!password?.trim()) {
      throw new Error('Senha é obrigatória');
    }
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
