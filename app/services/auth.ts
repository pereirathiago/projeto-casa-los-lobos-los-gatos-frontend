import { LoginResponse } from './api';

const TOKEN_KEY = 'ong_auth_token';
const USER_KEY = 'ong_user_data';
const REMEMBER_ME_KEY = 'ong_remember_me';

class AuthService {
  // Salvar token e dados do usuário
  saveAuth(authData: LoginResponse, rememberMe: boolean = false): void {
    if (typeof window !== 'undefined') {
      const storage = rememberMe ? localStorage : sessionStorage;

      // Salvar dados
      storage.setItem(TOKEN_KEY, authData.token);
      storage.setItem(USER_KEY, JSON.stringify(authData.user));

      // Salvar preferência de lembrar
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    }
  }

  // Obter token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Verificar em localStorage primeiro (lembrar-me ativado)
      const localToken = localStorage.getItem(TOKEN_KEY);
      if (localToken) return localToken;

      // Verificar em sessionStorage (sessão atual)
      return sessionStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  // Obter dados do usuário
  getUser(): LoginResponse['user'] | null {
    if (typeof window !== 'undefined') {
      // Verificar em localStorage primeiro
      const localUserData = localStorage.getItem(USER_KEY);
      if (localUserData) return JSON.parse(localUserData);

      // Verificar em sessionStorage
      const sessionUserData = sessionStorage.getItem(USER_KEY);
      return sessionUserData ? JSON.parse(sessionUserData) : null;
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
      // Limpar localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);

      // Limpar sessionStorage
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
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

  // Verificar se é master admin
  isMasterAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin' && user?.is_master === true;
  }

  // Buscar e atualizar dados do usuário admin do backend
  async refreshAdminUser(apiService: {
    getMyProfile: (token: string) => Promise<{
      uuid: string;
      name: string;
      email: string;
      role: string;
      is_master: boolean;
    }>;
  }): Promise<LoginResponse['user'] | null> {
    if (typeof window === 'undefined') return null;

    try {
      const token = this.getToken();
      const user = this.getUser();

      if (!token || !user || user.role !== 'admin') {
        return user;
      }

      // Buscar dados atualizados do backend
      const profile = await apiService.getMyProfile(token);
      const updatedUser: LoginResponse['user'] = {
        id: profile.uuid,
        name: profile.name,
        email: profile.email,
        role: profile.role as 'admin' | 'sponsor',
        is_master: profile.is_master,
      };

      // Atualizar storage
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      this.saveAuth({ token, user: updatedUser }, rememberMe);

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      return this.getUser();
    }
  }

  // Buscar e atualizar dados do sponsor do backend
  async refreshSponsorUser(apiService: {
    getMySponsorProfile: (token: string) => Promise<{
      uuid: string;
      name: string;
      email: string;
      active: boolean;
      deleted: boolean;
    }>;
  }): Promise<LoginResponse['user'] | null> {
    if (typeof window === 'undefined') return null;

    try {
      const token = this.getToken();
      const user = this.getUser();

      if (!token || !user || user.role !== 'sponsor') {
        return user;
      }

      // Buscar dados atualizados do backend
      const profile = await apiService.getMySponsorProfile(token);
      const updatedUser: LoginResponse['user'] = {
        id: profile.uuid,
        name: profile.name,
        email: profile.email,
        role: 'sponsor',
      };

      // Atualizar storage
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      this.saveAuth({ token, user: updatedUser }, rememberMe);

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar dados do sponsor:', error);
      return this.getUser();
    }
  }
}

export const authService = new AuthService();
