import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

export type CaptureConfig = {
  url: string;
  deviceTypes: string[];
  captureFullPage: boolean;
  captureDynamicElements: boolean;
  customSizes?: {
    name: string;
    width: number;
    height: number;
  }[];
};

export type CaptureStatus = {
  id: number;
  status: string;
  progress: number;
  error: string | null;
};

export function useCaptures() {
  const { data: captures, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/v1/captures'],
    throwOnError: false,
  });

  const createCaptureMutation = useMutation({
    mutationFn: (captureConfig: CaptureConfig) => {
      return apiRequest('/api/v1/captures', {
        method: 'POST',
        body: JSON.stringify(captureConfig),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/captures'] });
      toast({
        title: '캡처 작업 시작',
        description: '웹사이트 캡처가 백그라운드에서 진행 중입니다.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: '캡처 실패',
        description: error.message || '캡처 작업을 시작하지 못했습니다.',
        variant: 'destructive',
      });
    },
  });

  const getCaptureStatus = (captureId: number) => {
    return useQuery({
      queryKey: ['/api/v1/captures', captureId, 'status'],
      queryFn: () => apiRequest(`/api/v1/captures/${captureId}/status`),
      refetchInterval: (data: CaptureStatus) => {
        // 완료 또는 오류 상태면 폴링 중지
        if (data?.status === 'completed' || data?.status === 'error') {
          return false;
        }
        // 진행 중이면 3초마다 폴링
        return 3000;
      },
    });
  };

  const getCaptureDetails = (captureId: number) => {
    return useQuery({
      queryKey: ['/api/v1/captures', captureId],
      queryFn: () => apiRequest(`/api/v1/captures/${captureId}`),
    });
  };

  return {
    captures,
    isLoading,
    error,
    refetch,
    createCapture: createCaptureMutation.mutate,
    isPending: createCaptureMutation.isPending,
    getCaptureStatus,
    getCaptureDetails,
  };
}

export function useUrlValidation() {
  const validateUrlMutation = useMutation({
    mutationFn: (url: string) => {
      return apiRequest('/api/v1/url/validate', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  });

  return {
    validateUrl: validateUrlMutation.mutate,
    isValidating: validateUrlMutation.isPending,
    validationResult: validateUrlMutation.data,
    validationError: validateUrlMutation.error,
  };
}