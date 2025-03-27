import { useState } from 'react';
import { Link } from 'wouter';
import { CaptureWithDetails } from '@shared/schema';
import CaptureStatusBadge from './CaptureStatusBadge';
import TagBadge from '../tags/TagBadge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface CaptureListProps {
  captures: CaptureWithDetails[];
  isLoading: boolean;
}

export default function CaptureList({ captures, isLoading }: CaptureListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg animate-pulse">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <div className="h-6 bg-gray-300 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-64"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded-md w-20"></div>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!captures || captures.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Current Captures</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Processing status of current capture jobs</p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-6 text-center">
          <p className="text-gray-500">No captures in progress. Start a new capture above.</p>
        </div>
      </div>
    );
  }

  // Toggle expanded state for a capture
  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Current Captures</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Processing status of current capture jobs</p>
        </div>
        <div>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => {
              /* Would refresh captures in a real implementation */
            }}
          >
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {captures.map((capture) => (
            <li key={capture.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-primary truncate">
                      {capture.website?.name || 'Unknown website'}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <CaptureStatusBadge status={capture.status} />
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <Link href={`/captures/${capture.id}`}>
                      <button
                        type="button"
                        className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        View
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={() => toggleExpanded(capture.id)}
                    >
                      <svg
                        className={`h-4 w-4 transform ${expanded[capture.id] ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      {capture.completedPageCount || 0} / {capture.pageCount || 0} pages captured
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      {capture.deviceTypes?.join(', ') || 'No devices'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>
                      {capture.createdAt ? format(new Date(capture.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                    </p>
                  </div>
                </div>
                
                {/* Progress bar for in-progress captures */}
                {capture.status === 'in_progress' && (
                  <div className="mt-2">
                    <Progress value={capture.progress} className="h-2.5" />
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      {capture.progress}% complete
                    </span>
                  </div>
                )}
                
                {/* Error message for failed captures */}
                {capture.status === 'failed' && capture.error && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">Error: {capture.error}</p>
                  </div>
                )}
                
                {/* Expanded details */}
                {expanded[capture.id] && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Captured Pages</h4>
                    <ul className="space-y-2">
                      {capture.pages?.map((page) => (
                        <li key={page.id} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-800 truncate">{page.title || page.url}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
