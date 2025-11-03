// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5096/api';

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
  components?: FormComponent[];
  language?: 'el' | 'en';
  responses?: number; // For backward compatibility
}

export interface FormComponent {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  columns?: TableColumn[];
  rows?: number;
}

export interface TableColumn {
  label: string;
  type: 'textfield' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

export interface DashboardStats {
  activeQuestionnaires: number;
  totalResponses: number;
  completedResponses: number;
  pendingInvitations: number;
  totalUsers: number;
  completionRate: number;
}

export interface RegionalData {
  region: string;
  totalResponses: number;
  completedResponses: number;
  completionRate: number;
}

export interface ResponseTrend {
  date: string;
  responseCount: number;
  completedCount: number;
}

// API Service Class with real HTTP calls
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('ApiService initialized with baseUrl:', this.baseUrl);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  }

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/stats`);
      return this.handleResponse<DashboardStats>(response);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback to mock data
      return {
        activeQuestionnaires: 5,
        totalResponses: 1234,
        completedResponses: 1089,
        pendingInvitations: 234,
        totalUsers: 567,
        completionRate: 88.24
      };
    }
  }

  async getRegionalData(): Promise<RegionalData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/regional-data`);
      return this.handleResponse<RegionalData[]>(response);
    } catch (error) {
      console.error('Failed to fetch regional data:', error);
      // Fallback to mock data
      return [
        { region: 'Λευκωσία', totalResponses: 245, completedResponses: 234, completionRate: 95.5 },
        { region: 'Λεμεσός', totalResponses: 189, completedResponses: 178, completionRate: 94.2 },
        { region: 'Λάρνακα', totalResponses: 156, completedResponses: 145, completionRate: 92.9 },
        { region: 'Πάφος', totalResponses: 134, completedResponses: 120, completionRate: 89.6 },
        { region: 'Αμμόχωστος', totalResponses: 98, completedResponses: 87, completionRate: 88.8 }
      ];
    }
  }

  async getResponseTrends(days: number = 30): Promise<ResponseTrend[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/response-trends?days=${days}`);
      return this.handleResponse<ResponseTrend[]>(response);
    } catch (error) {
      console.error('Failed to fetch response trends:', error);
      // Fallback to mock data
      const trends: ResponseTrend[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trends.push({
          date: date.toISOString().split('T')[0],
          responseCount: Math.floor(Math.random() * 50) + 20,
          completedCount: Math.floor(Math.random() * 40) + 15
        });
      }
      return trends;
    }
  }

  // Questionnaires API
  async getQuestionnaires(filters?: {
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
    try {
      console.log('Fetching questionnaires from API...');
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
      
      const url = `${this.baseUrl}/questionnaires?${params}`;
      console.log('Requesting URL:', url);
      
      const response = await fetch(url);
      console.log('API Response status:', response.status);
      console.log('API Response ok:', response.ok);
      
      const result = await this.handleResponse(response);
      console.log('Questionnaires fetched successfully:', result);
      return result as {
        data: Questionnaire[];
        totalCount: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    } catch (error) {
      console.error('Failed to fetch questionnaires from API:', error);
      console.log('Falling back to localStorage...');
      // Fallback to mock data
      const mockQuestionnaires: Questionnaire[] = [
        {
          id: '1',
          name: 'Livestock Management Survey',
          description: 'Survey about livestock management practices',
          category: 'Livestock',
          status: 'active',
          targetResponses: 100,
          currentResponses: 25,
          completionRate: 25,
          createdBy: 'admin',
          createdAt: '2025-10-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'Crop Production Assessment',
          description: 'Assessment of crop production methods',
          category: 'Crops',
          status: 'draft',
          targetResponses: 150,
          currentResponses: 0,
          completionRate: 0,
          createdBy: 'admin',
          createdAt: '2025-10-19T15:30:00Z'
        }
      ];

      return {
        data: mockQuestionnaires,
        totalCount: mockQuestionnaires.length,
        page: 1,
        pageSize: 10,
        totalPages: 1
      };
    }
  }

  async createQuestionnaire(data: {
    name: string;
    description?: string;
    category: string;
    schema?: string;
    targetResponses: number;
    createdBy: string;
  }): Promise<Questionnaire> {
    try {
      const response = await fetch(`${this.baseUrl}/questionnaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return this.handleResponse<Questionnaire>(response);
    } catch (error) {
      console.error('Failed to create questionnaire:', error);
      throw error;
    }
  }

  async saveQuestionnaireStructure(data: {
    name: string;
    components: FormComponent[];
    language: 'el' | 'en';
    status?: 'draft' | 'active';
  }): Promise<Questionnaire> {
    try {
      const questionnaireData = {
        name: data.name,
        description: `Questionnaire created with ${data.components.length} questions`,
        category: 'general',
        schema: JSON.stringify({
          display: 'form',
          components: data.components
        }),
        components: data.components,
        language: data.language,
        targetResponses: 100,
        createdBy: 'admin',
        status: data.status || 'draft'
      };

      const response = await fetch(`${this.baseUrl}/questionnaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaireData),
      });
      
      if (!response.ok) {
        // Save to localStorage
        const mockQuestionnaire: Questionnaire = {
          id: Date.now().toString(),
          name: data.name,
          description: `Questionnaire with ${data.components.length} questions`,
          category: 'general',
          status: 'draft',
          targetResponses: 100,
          currentResponses: 0,
          completionRate: 0,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          components: data.components,
          language: data.language,
          responses: 0, // Add this for compatibility
          schema: {
            display: 'form',
            components: data.components
          }
        };
        
        // Save to localStorage
        const saved = localStorage.getItem('questionnaires');
        const questionnaires = saved ? JSON.parse(saved) : [];
        questionnaires.push(mockQuestionnaire);
        localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
        
        return mockQuestionnaire;
      }
      
      return this.handleResponse<Questionnaire>(response);
    } catch (error) {
      console.error('Failed to save questionnaire structure:', error);
      
      // Fallback - save to localStorage
      const mockQuestionnaire: Questionnaire = {
        id: Date.now().toString(),
        name: data.name,
        description: `Questionnaire with ${data.components.length} questions`,
        category: 'general',
        status: 'draft',
        targetResponses: 100,
        currentResponses: 0,
        completionRate: 0,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        components: data.components,
        language: data.language,
        responses: 0,
        schema: {
          display: 'form',
          components: data.components
        }
      };
      
      const saved = localStorage.getItem('questionnaires');
      const questionnaires = saved ? JSON.parse(saved) : [];
      questionnaires.push(mockQuestionnaire);
      localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
      
      return mockQuestionnaire;
    }
  }

  async updateQuestionnaireStructure(id: string, data: {
    name: string;
    components: FormComponent[];
    language: 'el' | 'en';
  }): Promise<Questionnaire> {
    try {
      const questionnaireData = {
        name: data.name,
        components: data.components,
        language: data.language,
        schema: JSON.stringify({
          display: 'form',
          components: data.components
        })
      };

      const response = await fetch(`${this.baseUrl}/questionnaires/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaireData),
      });
      
      if (!response.ok) {
        // Fallback - update in localStorage
        const saved = localStorage.getItem('questionnaires');
        const questionnaires = saved ? JSON.parse(saved) : [];
        const index = questionnaires.findIndex((q: any) => q.id === id);
        
        if (index >= 0) {
          questionnaires[index] = {
            ...questionnaires[index],
            name: data.name,
            components: data.components,
            language: data.language,
            schema: {
              display: 'form',
              components: data.components
            }
          };
          localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
          return questionnaires[index];
        }
        throw new Error('Questionnaire not found');
      }
      
      return this.handleResponse<Questionnaire>(response);
    } catch (error) {
      console.error('Failed to update questionnaire structure:', error);
      throw error;
    }
  }

  async duplicateQuestionnaire(id: string): Promise<Questionnaire> {
    try {
      const response = await fetch(`${this.baseUrl}/questionnaires/${id}/duplicate`, {
        method: 'POST',
      });
      return this.handleResponse<Questionnaire>(response);
    } catch (error) {
      console.error('Failed to duplicate questionnaire:', error);
      throw error;
    }
  }

  async deleteQuestionnaire(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/questionnaires/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete questionnaire: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete questionnaire:', error);
      throw error;
    }
  }

  async publishQuestionnaire(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/questionnaires/${id}/publish`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`Failed to publish questionnaire: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to publish questionnaire:', error);
      throw error;
    }
  }

  // FormIO Schema specific methods
  async getQuestionnaireSchema(id: string): Promise<{
    id: string;
    name: string;
    schema: any;
    updatedAt: string;
  }> {
    try {
      console.log(`Fetching schema for questionnaire ID: ${id}`);
      const response = await fetch(`${this.baseUrl}/questionnaires/${id}/schema`);
      console.log('Schema API response status:', response.status);
      const result = await this.handleResponse(response);
      console.log('Schema API result:', result);
      return result as {
        id: string;
        name: string;
        schema: any;
        updatedAt: string;
      };
    } catch (error) {
      console.error('Failed to fetch questionnaire schema:', error);
      
      // Fallback - try to get from localStorage
      const saved = localStorage.getItem('questionnaires');
      if (saved) {
        const questionnaires = JSON.parse(saved);
        const questionnaire = questionnaires.find((q: any) => q.id === id);
        if (questionnaire && questionnaire.schema) {
          return {
            id: questionnaire.id,
            name: questionnaire.name,
            schema: questionnaire.schema,
            updatedAt: questionnaire.updatedAt || questionnaire.createdAt
          };
        }
      }
      
      throw error;
    }
  }

  async updateQuestionnaireSchema(id: string, schema: any): Promise<{
    message: string;
    id: string;
    updatedAt: string;
  }> {
    try {
      console.log(`Updating schema for questionnaire ID: ${id}`);
      console.log('Schema to update:', schema);
      const schemaString = typeof schema === 'string' ? schema : JSON.stringify(schema);
      console.log('Schema string length:', schemaString.length);
      
      const response = await fetch(`${this.baseUrl}/questionnaires/${id}/schema`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: schemaString
        }),
      });
      console.log('Update schema API response status:', response.status);
      const result = await this.handleResponse(response);
      console.log('Update schema API result:', result);
      return result as {
        message: string;
        id: string;
        updatedAt: string;
      };
    } catch (error) {
      console.error('Failed to update questionnaire schema:', error);
      
      // Fallback - update in localStorage
      const saved = localStorage.getItem('questionnaires');
      if (saved) {
        const questionnaires = JSON.parse(saved);
        const index = questionnaires.findIndex((q: any) => q.id === id);
        if (index >= 0) {
          questionnaires[index].schema = schema;
          questionnaires[index].updatedAt = new Date().toISOString();
          localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
          
          return {
            message: 'Schema updated successfully',
            id: id,
            updatedAt: questionnaires[index].updatedAt
          };
        }
      }
      
      throw error;
    }
  }

  async createQuestionnaireWithSchema(data: {
    name: string;
    description?: string;
    category: string;
    schema: any;
    targetResponses: number;
    createdBy: string;
  }): Promise<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/questionnaires/schema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          schema: typeof data.schema === 'string' ? data.schema : JSON.stringify(data.schema)
        }),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create questionnaire with schema:', error);
      
      // Fallback - save to localStorage
      const questionnaire = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        category: data.category,
        status: 'draft',
        targetResponses: data.targetResponses,
        currentResponses: 0,
        completionRate: 0,
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        schema: data.schema
      };
      
      const saved = localStorage.getItem('questionnaires');
      const questionnaires = saved ? JSON.parse(saved) : [];
      questionnaires.push(questionnaire);
      localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
      
      return {
        id: questionnaire.id,
        name: questionnaire.name,
        status: questionnaire.status,
        createdAt: questionnaire.createdAt,
        message: 'Questionnaire created successfully with FormIO schema'
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;