import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionnaireService } from '../services/questionnaires';

// Hook for getting questionnaires list
export const useQuestionnaires = (params?: {
  status?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['questionnaires', params],
    queryFn: () => questionnaireService.getQuestionnaires(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


// Hook for getting questionnaire responses
export const useQuestionnaireResponses = (id: string) => {
  return useQuery({
    queryKey: ['questionnaire', id, 'responses'],
    queryFn: () => questionnaireService.getQuestionnaireResponses(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};