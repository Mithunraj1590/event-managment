// For Vercel deployment, API routes are served from the same domain
// Always use relative URLs to avoid localhost issues in production
const API_BASE_URL = '';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    console.log('API Request:', { url, method: config.method || 'GET', hasToken: !!this.token });

    try {
      console.log('Making fetch request to:', url);
      const response = await fetch(url, config);
      console.log('API Response:', { 
        status: response.status, 
        statusText: response.statusText, 
        url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { 
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            statusText: response.statusText
          };
        }
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success:', { endpoint, dataLength: Array.isArray(data) ? data.length : Object.keys(data).length });
      return data;
    } catch (error) {
      console.error('API Request Failed - Full Error Object:', error);
      console.error('API Request Failed - Error Type:', typeof error);
      console.error('API Request Failed - Error Constructor:', error?.constructor?.name);
      console.error('API Request Failed - Error Message:', error?.message);
      console.error('API Request Failed - Error Stack:', error?.stack);
      console.error('API Request Failed - URL:', url);
      console.error('API Request Failed - Config:', config);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message} (URL: ${url})`);
      } else {
        throw new Error(`API request failed: Unknown error (URL: ${url})`);
      }
    }
  }

  // Auth endpoints
  async register(data: { name: string; email: string; password: string }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string) {
    return this.request('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification(email: string) {
    return this.request('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Event endpoints
  async getEvents(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request(`/api/events${queryString ? `?${queryString}` : ''}`);
  }

  async getEvent(id: string) {
    return this.request(`/api/events/${id}`);
  }

  async createEvent(data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    maxAttendees: number;
    price?: number;
    image?: string;
    requirements?: string[];
    tags?: string[];
    isPublic?: boolean;
  }) {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/api/events/${id}`, {
      method: 'DELETE',
    });
  }

  async joinEvent(id: string) {
    return this.request(`/api/events/join/${id}`, {
      method: 'POST',
    });
  }

  async leaveEvent(id: string) {
    return this.request(`/api/events/${id}/leave`, {
      method: 'POST',
    });
  }

  async getUserEvents(type?: 'created' | 'joined' | 'all') {
    const params = type ? `?type=${type}` : '';
    return this.request(`/api/events/my-events${params}`);
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/api/users/profile');
  }

  async updateUserProfile(data: { name?: string; avatar?: string }) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/api/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request(`/api/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(id: string) {
    return this.request(`/api/users/${id}`);
  }

  async updateUserRole(id: string, role: string) {
    return this.request(`/api/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStats() {
    return this.request('/api/users/admin/stats');
  }

  async getAllEventsAdmin(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request(`/api/events/admin/all${queryString ? `?${queryString}` : ''}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
