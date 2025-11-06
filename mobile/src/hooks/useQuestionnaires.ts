import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionnaireService, Questionnaire, QuestionnaireDetails } from '../services/questionnaires';

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

// Hook for getting a single questionnaire
export const useQuestionnaire = (id: string) => {
  return useQuery({
    queryKey: ['questionnaire', id],
    queryFn: () => questionnaireService.getQuestionnaire(id),
    enabled: !!id, // Only run query if id is provided
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

// Hook for getting questionnaire schema
export const useQuestionnaireSchema = (id: string) => {
  return useQuery({
    queryKey: ['questionnaire', id, 'schema'],
    queryFn: () => questionnaireService.getQuestionnaireSchema(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for creating questionnaire
export const useCreateQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionnaireService.createQuestionnaire,
    onSuccess: () => {
      // Invalidate questionnaires list to refetch
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
  });
};

// Hook for updating questionnaire
export const useUpdateQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      questionnaireService.updateQuestionnaire(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific questionnaire and list
      queryClient.invalidateQueries({ queryKey: ['questionnaire', id] });
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
  });
};

// Hook for publishing questionnaire
export const usePublishQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionnaireService.publishQuestionnaire,
    onSuccess: (_, id) => {
      // Invalidate specific questionnaire and list
      queryClient.invalidateQueries({ queryKey: ['questionnaire', id] });
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
  });
};

// Hook for duplicating questionnaire
export const useDuplicateQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionnaireService.duplicateQuestionnaire,
    onSuccess: () => {
      // Invalidate questionnaires list
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
  });
};

// Hook for deleting questionnaire
export const useDeleteQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionnaireService.deleteQuestionnaire,
    onSuccess: (_, id) => {
      // Remove specific questionnaire from cache and invalidate list
      queryClient.removeQueries({ queryKey: ['questionnaire', id] });
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
  });
};