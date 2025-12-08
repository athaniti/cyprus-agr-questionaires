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

export interface SampleGroup {
  id: string;
  name: string;
  sampleId: string;
  sampleName:string;
  questionnaireId: string;
  questionnaireName:string;
  description?: string;
  serizedCriteria?: string;
  criteria?: any;
  serializedFarmIds?:string;
  farmIds?: string[];
  createdAt: Date;
  interviewerId?: string;
}

export interface Interviewer {
  id: string;
  firstName: string;
  lastName: string;
}
export interface QuestionnaireResponse {
  id: string;
  farmId: string;
  farm: Farm;
  status: string;
  completionPercentage: number;
  user?: Interviewer;
  updatedAt?: string;
  createdAt: string;
  serializedResponseData?: string; // JSON string containing the actual form data
  responseData?:any;
  notes?:string;
}



export interface Farm {
  id: string;
  farmCode: string;
  ownerName: string;
  province: string;
  community: string;
  farmType: string;
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
    userId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Questionnaire>> {
    const searchParams = new URLSearchParams();
    
    if (params?.status) searchParams.append('status', params.status);
    if (params?.userId) searchParams.append('userId', params.userId);
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


  async getSamplrGroups(id: string, params?: {
    userId?: string;
  }): Promise<SampleGroup[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.userId) searchParams.append('userId', params.userId);

    const queryString = searchParams.toString();
    const endpoint = `/questionnaires/${id}/sample-groups${queryString ? `?${queryString}` : ''}`;
    
    return apiService.get<SampleGroup[]>(endpoint);
  }

  async getSampleParticipants(sampleId: string): Promise<Farm[]> {
    const endpoint = `/samples/${sampleId}/participants`;
    return apiService.get<Farm[]>(endpoint);
  }

  async getQuestionnaireParticipantResponse(id: string, farmId:string): Promise<QuestionnaireResponse> {
    return apiService.get<QuestionnaireResponse>(`/questionnaires/${id}/participants/${farmId}/response`);
  }

  async createEmptyQuestionnaireParticipantResponse(id: string, farmId:string): Promise<QuestionnaireResponse> {
    return apiService.post<QuestionnaireResponse>(`/questionnaires/${id}/participants/${farmId}/response`);
  }

  async updateQuestionnaireParticipantResponse(id: string, farmId:string, responseData: QuestionnaireResponse): Promise<QuestionnaireResponse> {
    return apiService.put<QuestionnaireResponse>(`/questionnaires/${id}/participants/${farmId}/response`, responseData);
  }
}

export const questionnaireService = new QuestionnairesService();