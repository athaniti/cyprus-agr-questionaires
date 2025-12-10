// API Configuration and Base Service
// Detect environment and use appropriate API URL
const getApiBaseUrl = () => {
  // Check if running in Capacitor (mobile)
  if (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:') {
    return 'http://192.168.30.19:5050/api';  // iOS simulator
  }
  
  // Check if running on network IP (development)
  if (window.location.hostname === '192.168.30.19') {
    return 'http://192.168.30.19:5050/api';  // Network development
  }
  
  // Default to localhost for web development
  return 'http://localhost:5050/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging - only in development
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 API Configuration:', {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    apiUrl: API_BASE_URL
  });
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
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

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  getApiUrl()  {
    return this.baseURL;
  }
}

export const apiService = new ApiService();