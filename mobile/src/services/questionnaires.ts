import { apiService, PaginatedResponse } from './api';

// Types
export interface Theme {
  id: string;
  name: string;
  description?: string;
  logoImageBase64?: string;
  logoPosition: 'left' | 'center' | 'right';
  bodyFont: string;
  bodyFontSize: number;
  headerFont: string;
  headerFontSize: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  createdAt: Date;
  updatedAt?: Date;
  isDefault?: boolean;
}
export interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  serializedSchema: string;
  schema?: any;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  themeId?: string;
  status: string;
  responsesCount:number;
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



export interface Quota {
  id: string;
  region: string;
  municipality: string;
  targetCount: number;
  currentCount: number;
  category: string;
}

// Questionnaire Service
class QuestionnairesService {
  async getThemes():Promise<Theme[]> {
    return apiService.get<Theme[]>('/themes');
  }
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
  async getQuestionnaire(id: string): Promise<Questionnaire> {
    return apiService.get<Questionnaire>(`/questionnaires/${id}`);
  }

  // Get questionnaire responses
  async getQuestionnaireResponses(id: string): Promise<QuestionnaireResponse[]> {
    return apiService.get<QuestionnaireResponse[]>(`/questionnaires/${id}/responses`);
  }



}

export const questionnaireService = new QuestionnairesService();