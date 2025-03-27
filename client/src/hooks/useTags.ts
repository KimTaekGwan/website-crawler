import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tag, InsertTag } from "@shared/schema";

export function useTags() {
  const { toast } = useToast();

  // Fetch all tags
  const { 
    data: tags, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  // Create a new tag
  const createTag = useMutation({
    mutationFn: (tagData: InsertTag) => 
      apiRequest('POST', '/api/tags', tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: "Tag created",
        description: "The tag has been created successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating tag",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete a tag
  const deleteTag = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: "Tag deleted",
        description: "The tag has been deleted successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting tag",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Get website tags
  const getWebsiteTags = (websiteId: number) => {
    return useQuery<Tag[]>({
      queryKey: [`/api/websites/${websiteId}/tags`],
    });
  };

  // Get page tags
  const getPageTags = (pageId: number) => {
    return useQuery<Tag[]>({
      queryKey: [`/api/pages/${pageId}/tags`],
    });
  };

  // Add tag to website
  const addTagToWebsite = useMutation({
    mutationFn: ({ websiteId, tagId }: { websiteId: number; tagId: number }) => 
      apiRequest('POST', `/api/websites/${websiteId}/tags`, { tagId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/websites/${variables.websiteId}/tags`] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites'] });
      toast({
        title: "Tag added",
        description: "The tag has been added to the website."
      });
    }
  });

  // Add tag to page
  const addTagToPage = useMutation({
    mutationFn: ({ pageId, tagId }: { pageId: number; tagId: number }) => 
      apiRequest('POST', `/api/pages/${pageId}/tags`, { tagId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${variables.pageId}/tags`] });
      toast({
        title: "Tag added",
        description: "The tag has been added to the page."
      });
    }
  });

  // Remove tag from page
  const removeTagFromPage = useMutation({
    mutationFn: ({ pageId, tagId }: { pageId: number; tagId: number }) => 
      apiRequest('DELETE', `/api/pages/${pageId}/tags/${tagId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${variables.pageId}/tags`] });
      toast({
        title: "Tag removed",
        description: "The tag has been removed from the page."
      });
    }
  });

  return {
    tags,
    isLoading,
    isError,
    error,
    refetch,
    createTag,
    deleteTag,
    getWebsiteTags,
    getPageTags,
    addTagToWebsite,
    addTagToPage,
    removeTagFromPage
  };
}
