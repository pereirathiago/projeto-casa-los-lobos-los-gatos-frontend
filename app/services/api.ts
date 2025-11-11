// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sponsor';
  };
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
  };
}

export interface AnimalResponse {
  message: string;
  animal: {
    id: string;
    name: string;
    type: 'dog' | 'cat';
    breed: string;
    age: number;
    description: string;
    photo_url: string;
    tags: Array<{ id: string; label: string; color: string }>;
    created_at: string;
  };
}

export interface Admin {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'admin';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  password?: string;
  active?: boolean;
}

export interface CreateAdminResponse {
  message: string;
  admin: Admin;
}

export interface UpdateAdminResponse {
  message: string;
  admin: Admin;
}

export interface DeleteAdminResponse {
  message: string;
}

export interface ApiError {
  error: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      try {
        const errorData = await response.json();
        // Tenta pegar a mensagem de erro do backend
        const errorMessage =
          errorData.message ||
          errorData.error ||
          'Erro ao processar requisição';
        throw new Error(errorMessage);
      } catch (error) {
        // Se não conseguir fazer parse do JSON, retorna erro genérico
        if (error instanceof Error && error.message) {
          throw error;
        }
        throw new Error('Erro ao processar requisição');
      }
    }
    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<RegisterResponse>(response);
  }

  async logout(token: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer logout');
    }
  }

  async createAnimal(
    token: string,
    formData: FormData,
  ): Promise<AnimalResponse> {
    const response = await fetch(`${this.baseURL}/animals`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return this.handleResponse<AnimalResponse>(response);
  }

  // ==================== ADMIN CRUD ====================

  async createAdmin(
    token: string,
    adminData: CreateAdminData,
  ): Promise<CreateAdminResponse> {
    const response = await fetch(`${this.baseURL}/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });

    return this.handleResponse<CreateAdminResponse>(response);
  }

  async getAdmins(token: string): Promise<Admin[]> {
    const response = await fetch(`${this.baseURL}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Admin[]>(response);
  }

  async getAdminById(token: string, id: string): Promise<Admin> {
    const response = await fetch(`${this.baseURL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Admin>(response);
  }

  async updateAdmin(
    token: string,
    id: string,
    adminData: UpdateAdminData,
  ): Promise<Admin> {
    const response = await fetch(`${this.baseURL}/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });

    return this.handleResponse<Admin>(response);
  }

  async deleteAdmin(token: string, id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/admin/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar administrador');
    }
  }
}

export const apiService = new ApiService();
