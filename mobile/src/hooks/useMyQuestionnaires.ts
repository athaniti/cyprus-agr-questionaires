import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionnaireService } from '../services/questionnaires';

// Hook for getting questionnaires list
export const useMyQuestionnaires = (params: {
  status?: string;
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['questionnaires', params],
    queryFn: () => questionnaireService.getQuestionnaires({...params, userId:'11111111-1111-1111-1111-111111111111'}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
