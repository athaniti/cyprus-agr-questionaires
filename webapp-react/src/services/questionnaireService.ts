import { Farm, SampleGroup } from "./samplesService";

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

export interface InvitationBatch {
  id: string;
  name: string;
  templateId:string;
  templateName:string;
  questionnaireId: string;
  questionnaireName: string;
  serializedFarmIds?:string;
  recipientFarmIds?:any[];
  sentAt?:string;
  scheduledAt?:string;
  totalResponses?:number;
  totalCompleted?:number;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  logoAlignment:string;
  logoImageBase64:string;
  plainTextContent:string;
  questionnaireId:string;
  questionnaireName: string;
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

  static async getQuestionnaireSampleGroups(id:string): Promise<SampleGroup[]> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}/sample-groups`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async getQuestionnaireParticipants(id:string): Promise<Farm[]> {
    const response = await fetch(`${API_BASE_URL}/questionnaires/${id}/participants`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async getInvitationBatches(): Promise<InvitationBatch[]> {
    const response = await fetch(`${API_BASE_URL}/invitations/batches`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async createInvitationBatch(invitationBatch:InvitationBatch):Promise<InvitationBatch> {
    const response = await fetch(`${API_BASE_URL}/invitations/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitationBatch),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async getInvitationTemplates(): Promise<InvitationTemplate[]>{
    const response = await fetch(`${API_BASE_URL}/invitations/templates`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async createInvitationTemplate(template:InvitationTemplate): Promise<InvitationTemplate>{
    const response = await fetch(`${API_BASE_URL}/invitations/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async updateInvitationTemplate(id:string, template:InvitationTemplate): Promise<InvitationTemplate>{
    const response = await fetch(`${API_BASE_URL}/invitations/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

    static async deleteInvitationTemplate(id:string): Promise<void>{
    const response = await fetch(`${API_BASE_URL}/invitations/templates/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  }
}