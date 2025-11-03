const API_BASE_URL = 'http://localhost:5096/api';

export interface QuestionnaireRequest {
  name: string;
  description?: string;
  category: string;
  schema: any;
  targetResponses: number;
  createdBy: string; // In real app, get from JWT token
}

export interface QuestionnaireResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  schema: any;
  targetResponses: number;
  currentResponses: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export class QuestionnaireService {
  
  // Get all questionnaires
  static async getQuestionnaires(
    status?: string,
    category?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: QuestionnaireResponse[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_BASE_URL}/questionnaires?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Get questionnaire by ID
  static async getQuestionnaire(id: string): Promise<QuestionnaireResponse> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Create new questionnaire
  static async createQuestionnaire(questionnaire: QuestionnaireRequest): Promise<QuestionnaireResponse> {
    const response = await fetch(`${API_BASE_URL}/questionnaires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionnaire),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Update questionnaire
  static async updateQuestionnaire(
    id: string, 
    questionnaire: Partial<QuestionnaireRequest>
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionnaire),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  // Publish questionnaire
  static async publishQuestionnaire(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}/publish`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Duplicate questionnaire
  static async duplicateQuestionnaire(id: string): Promise<QuestionnaireResponse> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}/duplicate`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Delete questionnaire
  static async deleteQuestionnaire(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}