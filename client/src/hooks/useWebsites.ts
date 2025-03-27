import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { WebsiteWithDetails, Page, InsertWebsite } from "@shared/schema";

export function useWebsites() {
  const { toast } = useToast();

  // Fetch all websites with details
  const { 
    data: websites, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<WebsiteWithDetails[]>({
    queryKey: ['/api/websites'],
  });

  // Fetch a single website by ID
  const getWebsiteById = (id: number | string) => {
    return useQuery<WebsiteWithDetails>({
      queryKey: [`/api/websites/${id}`],
    });
  };

  // Create a new website
  const createWebsite = useMutation({
    mutationFn: (websiteData: InsertWebsite) => 
      apiRequest('POST', '/api/websites', websiteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites'] });
      toast({
        title: "Website created",
        description: "The website has been added successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating website",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Get pages for a website
  const getWebsitePages = (websiteId: number) => {
    return useQuery<Page[]>({
      queryKey: [`/api/websites/${websiteId}/pages`],
    });
  };

  // Filter websites by tag
  const filterWebsitesByTag = (tagId?: number | null) => {
    if (!websites || !tagId) return websites;

    return websites.filter(website => 
      website.tags?.some(tag => tag.id === tagId)
    );
  };

  // Search websites by name or domain
  const searchWebsites = (searchTerm: string) => {
    if (!websites || !searchTerm) return websites;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return websites.filter(website => 
      website.name.toLowerCase().includes(lowerSearchTerm) ||
      website.domain.toLowerCase().includes(lowerSearchTerm) ||
      website.url.toLowerCase().includes(lowerSearchTerm)
    );
  };

  return {
    websites,
    isLoading,
    isError,
    error,
    refetch,
    getWebsiteById,
    createWebsite,
    getWebsitePages,
    filterWebsitesByTag,
    searchWebsites
  };
}
