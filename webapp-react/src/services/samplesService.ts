import { Questionnaire } from "./questionnaireService";

const API_BASE_URL = 'http://localhost:5050/api';

export interface SampleFilter {
  provinces?: string[];
  communities?: string[];
  farmTypes?: string[];
  sizeCategories?: string[];
  economicSizes?: string[];
  legalStatuses?: string[];
  mainCrops?: string[];
  livestockTypes?: string[];
  minimumArea?: number;
  maximumArea?: number;
  minimumValue?: number;
  maximumValue?: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface Sample {
  id: string;
  questionnaire: Questionnaire;
  questionnaireId: string;
  name: string;
  description: string;
  participantsCount: number;
  targetSize: number;
  serializedFilterCriteria: string;
  filterCriteria: any;
  createdAt: string;
  createdBy: string;
}

export interface Farm {
  id: string;
  farmCode: string;
  ownerName: string;
  province: string;
  community: string;
  farmType: string;
  totalArea: number;
  economicSize?: string;
  mainCrop?: string;
  livestockType?: string;
  legalStatus?: string;
  status?: string;
  sizeCategory?: string;
  createdAt?: string;
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

export class SamplesService {
  static async getSamples() : Promise<Sample[]> {
    const response = await fetch(`${API_BASE_URL}/samples`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async createSample(sample: Partial<Sample>): Promise<Sample> {
    const response = await fetch(`${API_BASE_URL}/samples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sample),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async updateSample(id:string, sample: Partial<Sample>): Promise<Sample> {
    const response = await fetch(`${API_BASE_URL}/samples/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sample),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async deleteSample(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/samples/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  static async createSampleParticipants(sampleId: string): Promise<void> {
    const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/participants`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  static async getSampleParticipants(sampleId: string): Promise<Farm[]> {
    const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/participants`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async getSampleGroups(sampleId:string): Promise<SampleGroup[]> {
    const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/sample-groups`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async createSampleGroup(sampleId:string, sampleGroup:SampleGroup): Promise<SampleGroup[]> {
    const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/sample-groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleGroup),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async updateSampleGroup(sampleId: string, id:string, sampleGroup:SampleGroup): Promise<SampleGroup[]> {
    const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/sample-groups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleGroup),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  static async deleteSampleGroup (sampleId:string, id:string): Promise<void> {
    const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/sample-groups/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

}
