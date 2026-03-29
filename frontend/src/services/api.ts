// API Configuration and HTTP Client for Frontend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private clearAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = false
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string, role: 'student' | 'medical_officer' | 'admin') {
    const response = await this.request<{
      user: any;
      token: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });

    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'medical_officer';
    rollNumber?: string;
    department?: string;
  }) {
    const response = await this.request<{
      user: any;
      token: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async getProfile() {
    return this.request('/api/auth/profile', {
      method: 'GET',
    }, true);
  }

  async logout(): Promise<void> {
    this.clearAuthToken();
  }

  // Health Records endpoints
  async getHealthRecords(studentId?: string) {
    const query = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/api/health-records${query}`, {
      method: 'GET',
    }, true);
  }

  async createHealthRecord(data: {
    studentId?: string;
    recordType: string;
    description: string;
    date?: string;
  }) {
    return this.request('/api/health-records', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async updateHealthRecord(id: string, data: any) {
    return this.request(`/api/health-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true);
  }

  async deleteHealthRecord(id: string) {
    return this.request(`/api/health-records/${id}`, {
      method: 'DELETE',
    }, true);
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
