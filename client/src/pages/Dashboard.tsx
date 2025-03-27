import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/captures/StatsCards";
import NewCaptureForm from "@/components/captures/NewCaptureForm";
import CaptureList from "@/components/captures/CaptureList";
import CaptureCard from "@/components/captures/CaptureCard";
import { WebsiteWithDetails } from "@shared/schema";

export default function Dashboard() {
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  
  const { data: websites, isLoading: isLoadingWebsites } = useQuery<WebsiteWithDetails[]>({
    queryKey: ['/api/websites'],
  });

  const { data: captures, isLoading: isLoadingCaptures } = useQuery({
    queryKey: ['/api/captures'],
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['/api/tags'],
  });

  // Calculate stats
  const websiteCount = websites?.length || 0;
  const captureCount = captures?.length || 0;
  const tagCount = tags?.length || 0;

  // Filter websites by tag if tagFilter is set
  const filteredWebsites = websites?.filter(website => {
    if (!tagFilter) return true;
    return website.tags?.some(tag => tag.name === tagFilter);
  });

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Recent Captures</h1>
      </div>

      <div className="px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <StatsCards 
          websiteCount={websiteCount} 
          captureCount={captureCount} 
          tagCount={tagCount}
          isLoading={isLoadingWebsites || isLoadingCaptures || isLoadingTags}
        />
        
        {/* New Capture Form */}
        <div className="mt-8">
          <NewCaptureForm />
        </div>

        {/* Current Captures */}
        <div className="mt-8">
          <CaptureList captures={captures || []} isLoading={isLoadingCaptures} />
        </div>

        {/* Recent Website Captures */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Website Captures</h2>
            <div className="flex space-x-3">
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => {
                    // This would open a dropdown in a real implementation
                    setTagFilter(null);
                  }}
                >
                  Filter by tag
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Sort by
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingWebsites ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredWebsites?.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No websites found.</p>
              </div>
            ) : (
              filteredWebsites?.map((website) => (
                <CaptureCard key={website.id} website={website} />
              ))
            )}
          </div>

          {filteredWebsites && filteredWebsites.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
