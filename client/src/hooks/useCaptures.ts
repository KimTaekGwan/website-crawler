import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CaptureWithDetails, CaptureConfig } from "@shared/schema";

export function useCaptures() {
  const { toast } = useToast();

  // Fetch all captures
  const { 
    data: captures, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<CaptureWithDetails[]>({
    queryKey: ['/api/captures'],
  });

  // Fetch a single capture by ID
  const getCaptureById = (id: number | string) => {
    return useQuery<CaptureWithDetails>({
      queryKey: [`/api/captures/${id}`],
    });
  };

  // Create a new capture
  const createCapture = useMutation({
    mutationFn: (captureConfig: CaptureConfig) => 
      apiRequest('POST', '/api/captures', captureConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/captures'] });
      toast({
        title: "Capture started",
        description: "The capture process has been initiated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error starting capture",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update capture status
  const updateCaptureStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest('PATCH', `/api/captures/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/captures'] });
      queryClient.invalidateQueries({ queryKey: [`/api/captures/${variables.id}`] });
      toast({
        title: "Capture updated",
        description: "The capture status has been updated."
      });
    }
  });

  // Retry a failed capture
  const retryCapture = useMutation({
    mutationFn: (id: number) => 
      apiRequest('POST', `/api/captures/${id}/retry`, {}),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/captures'] });
      queryClient.invalidateQueries({ queryKey: [`/api/captures/${id}`] });
      toast({
        title: "Capture retry initiated",
        description: "The capture process will be retried."
      });
    }
  });

  return {
    captures,
    isLoading,
    isError,
    error,
    refetch,
    getCaptureById,
    createCapture,
    updateCaptureStatus,
    retryCapture
  };
}
