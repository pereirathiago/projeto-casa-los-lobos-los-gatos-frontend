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
    is_master?: boolean;
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

export interface AnimalPhoto {
  id: number;
  uuid: string;
  animal_id: number;
  photo_url: string;
  order_index: number;
  created_at: string;
}

export interface AnimalTag {
  id: string;
  label: string;
  color: string;
}

export interface Animal {
  id: number;
  uuid: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number;
  description: string;
  photo_url: string | null;
  photos: AnimalPhoto[];
  tags: AnimalTag[];
  created_at: string;
  updated_at: string;
}

export interface AnimalResponse {
  message: string;
  animal: Animal;
}

export interface AnimalFilters {
  type?: 'dog' | 'cat';
  breed?: string;
  minAge?: number;
  maxAge?: number;
}

export interface Admin {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'admin';
  is_master: boolean;
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

export interface Sponsor {
  uuid: string;
  name: string;
  email: string;
  active: boolean;
  deleted: boolean;
}

export interface UpdateSponsorData {
  name?: string;
  email?: string;
  password?: string;
}

export interface Sponsorship {
  uuid: string;
  user: {
    uuid: string;
    name: string;
    email: string;
  };
  animal: {
    uuid: string;
    name: string;
    type: 'dog' | 'cat';
    breed: string;
  };
  monthlyAmount: number;
  active: boolean;
  date: string;
}

export interface CreateSponsorshipData {
  userId: string;
  animalId: string;
  monthlyAmount: number;
}

export interface UpdateSponsorshipData {
  animalId?: string;
  monthlyAmount?: number;
  active?: boolean;
}

export interface ApiError {
  error: string;
}

// ==================== DASHBOARD INTERFACES ====================

export interface AdminDashboard {
  animals: {
    total: number;
    active: number;
  };
  sponsors: {
    total: number;
    active: number;
    deleted: number;
  };
  sponsorships: {
    totalActive: number;
  };
  donations: {
    total: number;
    thisMonth: number;
    general: {
      total: number;
      average: number;
    };
    day: {
      total: number;
      average: number;
    };
    week: {
      total: number;
      average: number;
    };
    month: {
      total: number;
      average: number;
    };
    year: {
      total: number;
      average: number;
    };
  };
  topAnimals: Array<{
    uuid: string;
    name: string;
    type: 'dog' | 'cat';
    sponsorshipCount: number;
  }>;
  topSponsors: Array<{
    uuid: string;
    name: string;
    email: string;
    totalDonations: number;
  }>;
}

export interface SponsorDashboard {
  godchildren: {
    total: number;
  };
  contributions: {
    total: number;
  };
  monthsAsSponsor: number;
  donations: {
    general: {
      total: number;
      average: number;
    };
    day: {
      total: number;
      average: number;
    };
    week: {
      total: number;
      average: number;
    };
    month: {
      total: number;
      average: number;
    };
    year: {
      total: number;
      average: number;
    };
  };
  history: {
    firstSponsorshipDate: string;
    totalSponsorshipsEver: number;
  };
}

export interface MySponsoredAnimal {
  uuid: string;
  animal: {
    uuid: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    description: string;
    photo: string | null;
    tags: Array<{
      label: string;
      color: string;
    }>;
  };
  active: boolean;
  sponsoredSince: string;
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

  // ==================== ANIMALS CRUD ====================

  async getAnimals(token: string, filters?: AnimalFilters): Promise<Animal[]> {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.breed) params.append('breed', filters.breed);
    if (filters?.minAge) params.append('minAge', filters.minAge.toString());
    if (filters?.maxAge) params.append('maxAge', filters.maxAge.toString());

    const queryString = params.toString();
    const url = `${this.baseURL}/animals${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleResponse<Animal[]>(response);
  }

  async getAnimalByUuid(token: string, uuid: string): Promise<Animal> {
    const response = await fetch(`${this.baseURL}/animals/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return this.handleResponse<Animal>(response);
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

  async updateAnimal(
    token: string,
    uuid: string,
    data: {
      name?: string;
      type?: 'dog' | 'cat';
      breed?: string;
      age?: number;
      description?: string;
      tags?: Array<{ id: string; label: string; color: string }>;
    },
  ): Promise<AnimalResponse> {
    const response = await fetch(`${this.baseURL}/animals/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<AnimalResponse>(response);
  }

  async addAnimalPhoto(
    token: string,
    animalUuid: string,
    photoFile: File,
  ): Promise<{ message: string; photo: AnimalPhoto }> {
    const formData = new FormData();
    formData.append('arquivo', photoFile);

    const response = await fetch(
      `${this.baseURL}/animals/${animalUuid}/photos`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    return this.handleResponse<{ message: string; photo: AnimalPhoto }>(
      response,
    );
  }

  async deleteAnimalPhoto(
    token: string,
    animalUuid: string,
    photoUuid: string,
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseURL}/animals/${animalUuid}/photos/${photoUuid}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return this.handleResponse<{ message: string }>(response);
  }

  async deleteAnimal(
    token: string,
    uuid: string,
  ): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/animals/${uuid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<{ message: string }>(response);
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

  // ==================== MY PROFILE (Admin) ====================

  async getMyProfile(token: string): Promise<Admin> {
    const response = await fetch(`${this.baseURL}/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Admin>(response);
  }

  async updateMyProfile(
    token: string,
    adminData: UpdateAdminData,
  ): Promise<UpdateAdminResponse> {
    const response = await fetch(`${this.baseURL}/admin/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });

    return this.handleResponse<UpdateAdminResponse>(response);
  }

  // ==================== SPONSOR PROFILE ====================

  async getMySponsorProfile(token: string): Promise<Sponsor> {
    const response = await fetch(`${this.baseURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Sponsor>(response);
  }

  async updateMySponsorProfile(
    token: string,
    data: UpdateSponsorData,
  ): Promise<Sponsor> {
    const response = await fetch(`${this.baseURL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<Sponsor>(response);
  }

  async deleteMySponsorProfile(token: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar conta');
    }
  }

  async getAllSponsors(token: string): Promise<Sponsor[]> {
    const response = await fetch(`${this.baseURL}/admin/sponsors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Sponsor[]>(response);
  }

  async searchSponsorByEmail(token: string, email: string): Promise<Sponsor[]> {
    const response = await fetch(
      `${this.baseURL}/admin/sponsors/search?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return this.handleResponse<Sponsor[]>(response);
  }

  // ==================== SPONSORSHIPS CRUD ====================

  async createSponsorship(
    token: string,
    data: CreateSponsorshipData,
  ): Promise<Sponsorship> {
    const response = await fetch(`${this.baseURL}/sponsorships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<Sponsorship>(response);
  }

  async getSponsorships(token: string): Promise<Sponsorship[]> {
    const response = await fetch(`${this.baseURL}/sponsorships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Sponsorship[]>(response);
  }

  async getSponsorshipByUuid(
    token: string,
    uuid: string,
  ): Promise<Sponsorship> {
    const response = await fetch(`${this.baseURL}/sponsorships/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<Sponsorship>(response);
  }

  async updateSponsorship(
    token: string,
    uuid: string,
    data: UpdateSponsorshipData,
  ): Promise<Sponsorship> {
    const response = await fetch(`${this.baseURL}/sponsorships/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<Sponsorship>(response);
  }

  async deleteSponsorship(token: string, uuid: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/sponsorships/${uuid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar apadrinhamento');
    }
  }

  // ==================== DASHBOARDS ====================

  async getAdminDashboard(token: string): Promise<AdminDashboard> {
    const response = await fetch(`${this.baseURL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<AdminDashboard>(response);
  }

  async getSponsorDashboard(token: string): Promise<SponsorDashboard> {
    const response = await fetch(`${this.baseURL}/users/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<SponsorDashboard>(response);
  }

  async getMySponsorships(token: string): Promise<MySponsoredAnimal[]> {
    const response = await fetch(`${this.baseURL}/users/me/sponsorships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse<MySponsoredAnimal[]>(response);
  }
}

export const apiService = new ApiService();
