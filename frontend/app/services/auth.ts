import { LoginResponse } from './api';

const TOKEN_KEY = 'ong_auth_token';
const USER_KEY = 'ong_user_data';

class AuthService {
  // Salvar token e dados do usuário
  saveAuth(authData: LoginResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    }
  }

  // Obter token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  // Obter dados do usuário
  getUser(): LoginResponse['user'] | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Limpar autenticação
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  // Verificar se é admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // Verificar se é padrinho
  isSponsor(): boolean {
    const user = this.getUser();
    return user?.role === 'sponsor';
  }
}

export const authService = new AuthService();
