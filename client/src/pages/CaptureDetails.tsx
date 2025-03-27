import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { CaptureWithDetails } from "@shared/schema";
import CaptureStatusBadge from "@/components/captures/CaptureStatusBadge";
import TagBadge from "@/components/tags/TagBadge";
import { Progress } from "@/components/ui/progress";

interface ScreenshotProps {
  pagePath: string;
  deviceType: string;
}

// A placeholder for the actual screenshot display
function Screenshot({ pagePath, deviceType }: ScreenshotProps) {
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="bg-gray-100 h-8 flex items-center px-3 border-b border-gray-200">
        <span className="text-sm text-gray-600 font-medium">{deviceType}</span>
      </div>
      <div className="h-96 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Screenshot would be displayed here for {pagePath}</p>
      </div>
    </div>
  );
}

export default function CaptureDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: capture, isLoading } = useQuery<CaptureWithDetails>({
    queryKey: [`/api/captures/${id}`],
  });

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 md:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!capture) {
    return (
      <div className="py-6 px-4 sm:px-6 md:px-8">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">Capture not found</h2>
          <p className="mt-2 text-sm text-gray-500">The capture you're looking for does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {capture.website?.name || 'Unknown Website'}
            </h1>
            <p className="text-sm text-gray-500">{capture.website?.url}</p>
          </div>
          <CaptureStatusBadge status={capture.status} />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {/* This would display website tags if available */}
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Capture Details</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <CaptureStatusBadge status={capture.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(capture.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Device Types</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {capture.deviceTypes.join(', ')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pages</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {`${capture.completedPageCount || 0} / ${capture.pageCount || 0} completed`}
              </dd>
            </div>
            {capture.status === 'in_progress' && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Progress</dt>
                <dd className="mt-1">
                  <Progress value={capture.progress} className="h-2" />
                  <span className="text-xs text-gray-500 mt-1 inline-block">
                    {capture.progress}% complete
                  </span>
                </dd>
              </div>
            )}
            {capture.error && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Error</dt>
                <dd className="mt-1 text-sm text-red-600">
                  {capture.error}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {capture.pages && capture.pages.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Captured Pages
          </h2>
          
          <div className="space-y-8">
            {capture.pages.map((page) => (
              <div key={page.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {page.title || 'Untitled Page'}
                    </h3>
                    <p className="text-sm text-gray-500">{page.url}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {capture.deviceTypes.map((deviceType) => (
                      <Screenshot key={deviceType} pagePath={page.url} deviceType={deviceType} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
