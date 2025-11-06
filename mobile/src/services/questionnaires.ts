import { apiService, PaginatedResponse } from './api';

// Types
export interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  targetResponses: number;
  currentResponses: number;
  completionRate: number;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  samplesCount: number;
  samples: Sample[];
}

export interface Sample {
  id: string;
  name: string;
  targetSize: number;
  status: string;
  createdAt: string;
}

export interface QuestionnaireResponse {
  id: string;
  status: string;
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  farmName?: string;
  region?: string;
  municipality?: string;
  userName: string;
  email: string;
}

export interface QuestionnaireDetails extends Questionnaire {
  schema: any;
  responseCount: number;
  quotas: Quota[];
}

export interface Quota {
  id: string;
  region: string;
  municipality: string;
  targetCount: number;
  currentCount: number;
  category: string;
}

// Questionnaire Service
class QuestionnaireService {
  // Get all questionnaires with pagination and filters
  async getQuestionnaires(params?: {
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Questionnaire>> {
    const searchParams = new URLSearchParams();
    
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const queryString = searchParams.toString();
    const endpoint = `/questionnaires${queryString ? `?${queryString}` : ''}`;
    
    return apiService.get<PaginatedResponse<Questionnaire>>(endpoint);
  }

  // Get questionnaire by ID
  async getQuestionnaire(id: string): Promise<QuestionnaireDetails> {
    return apiService.get<QuestionnaireDetails>(`/questionnaires/${id}`);
  }

  // Get questionnaire responses
  async getQuestionnaireResponses(id: string): Promise<QuestionnaireResponse[]> {
    return apiService.get<QuestionnaireResponse[]>(`/questionnaires/${id}/responses`);
  }

  // Get questionnaire schema
  async getQuestionnaireSchema(id: string): Promise<{
    id: string;
    name: string;
    schema: any;
    updatedAt: string;
  }> {
    return apiService.get(`/questionnaires/${id}/schema`);
  }

  // Create new questionnaire
  async createQuestionnaire(data: {
    name: string;
    description?: string;
    category: string;
    schema?: string;
    targetResponses: number;
    createdBy: string;
  }): Promise<Questionnaire> {
    return apiService.post<Questionnaire>('/questionnaires', data);
  }

  // Update questionnaire
  async updateQuestionnaire(id: string, data: {
    name?: string;
    description?: string;
    category?: string;
    schema?: string;
    targetResponses?: number;
  }): Promise<void> {
    return apiService.put<void>(`/questionnaires/${id}`, data);
  }

  // Publish questionnaire
  async publishQuestionnaire(id: string): Promise<void> {
    return apiService.put<void>(`/questionnaires/${id}/publish`);
  }

  // Duplicate questionnaire
  async duplicateQuestionnaire(id: string): Promise<Questionnaire> {
    return apiService.post<Questionnaire>(`/questionnaires/${id}/duplicate`);
  }

  // Delete questionnaire
  async deleteQuestionnaire(id: string): Promise<void> {
    return apiService.delete<void>(`/questionnaires/${id}`);
  }
}

export const questionnaireService = new QuestionnaireService();