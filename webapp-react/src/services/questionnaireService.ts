const API_BASE_URL = 'http://localhost:5050/api';

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

export class QuestionnaireService {
  
  // Get all questionnaires
  static async getQuestionnaires(
    status?: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<{ data: Questionnaire[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_BASE_URL}/questionnaires?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Get questionnaire by ID
  static async getQuestionnaire(id: string): Promise<Questionnaire> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Create new questionnaire
  static async createQuestionnaire(questionnaire: Partial<Questionnaire>): Promise<Questionnaire> {
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
    questionnaire: Partial<Questionnaire>
  ): Promise<Questionnaire> {
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