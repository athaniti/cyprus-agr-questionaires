// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7000/api';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst' | 'farmer';
  region?: string;
  organization?: string;
}

export interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  targetResponses: number;
  currentResponses: number;
  completionRate: number;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  schema?: any;
}

export interface Response {
  id: string;
  questionnaireId: string;
  questionnaireName: string;
  status: 'draft' | 'submitted' | 'completed';
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  farmName?: string;
  region?: string;
  municipality?: string;
  userName: string;
  email: string;
}

export interface DashboardStats {
  activeQuestionnaires: number;
  totalResponses: number;
  completedResponses: number;
  pendingInvitations: number;
  totalUsers: number;
  completionRate: number;
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
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

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Methods
  async login(email: string, password: string): Promise<{ user: User; message: string }> {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(email?: string): Promise<User> {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.request(`/users/current${query}`);
  }

  async getUsers(): Promise<User[]> {
    return this.request('/users');
  }

  // Questionnaire Methods
  async getQuestionnaires(params?: {
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    data: Questionnaire[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    
    const query = searchParams.toString();
    return this.request(`/questionnaires${query ? '?' + query : ''}`);
  }

  async getQuestionnaire(id: string): Promise<Questionnaire> {
    return this.request(`/questionnaires/${id}`);
  }

  async createQuestionnaire(data: {
    name: string;
    description?: string;
    category: string;
    schema?: string;
    targetResponses: number;
    createdBy: string;
  }): Promise<Questionnaire> {
    return this.request('/questionnaires', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuestionnaire(id: string, data: Partial<Questionnaire>): Promise<void> {
    return this.request(`/questionnaires/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async publishQuestionnaire(id: string): Promise<void> {
    return this.request(`/questionnaires/${id}/publish`, {
      method: 'PUT',
    });
  }

  // Response Methods
  async getResponses(params?: {
    questionnaireId?: string;
    status?: string;
    region?: string;
  }): Promise<Response[]> {
    const searchParams = new URLSearchParams();
    if (params?.questionnaireId) searchParams.append('questionnaireId', params.questionnaireId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.region) searchParams.append('region', params.region);
    
    const query = searchParams.toString();
    return this.request(`/responses${query ? '?' + query : ''}`);
  }

  async createResponse(data: {
    questionnaireId: string;
    userId: string;
    responseData?: string;
    farmName?: string;
    region?: string;
    municipality?: string;
  }): Promise<Response> {
    return this.request('/responses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResponse(id: string, data: {
    responseData?: string;
    status?: string;
    farmName?: string;
    region?: string;
  }): Promise<void> {
    return this.request(`/responses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/dashboard/stats');
  }

  async getRegionalData(): Promise<Array<{
    region: string;
    totalResponses: number;
    completedResponses: number;
    completionRate: number;
  }>> {
    return this.request('/dashboard/regional-data');
  }

  async getResponseTrends(days: number = 30): Promise<Array<{
    date: string;
    responseCount: number;
    completedCount: number;
  }>> {
    return this.request(`/dashboard/response-trends?days=${days}`);
  }

  async getCategoryDistribution(): Promise<Array<{
    category: string;
    questionnaireCount: number;
    responseCount: number;
    completedResponseCount: number;
  }>> {
    return this.request('/dashboard/category-distribution');
  }

  // Location Methods
  async getRegions(): Promise<Array<{
    id: string;
    name: string;
    code: string;
    latitude: number;
    longitude: number;
  }>> {
    return this.request('/locations/regions');
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health', { method: 'GET' });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;